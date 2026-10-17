#!/usr/bin/env python3
"""Zack Engine local server.
Serves this folder AND a small allow-listed web proxy (/proxy?url=...), so live feeds
(planes, satellites, places, ...) work even when a data source blocks direct browser requests (CORS).

Run:   python server.py            -> http://localhost:8000
       python server.py 8080       -> another port
       python server.py --lan      -> also reachable from other devices on your Wi-Fi
"""
import http.server, socketserver, urllib.request, urllib.parse, urllib.error, sys, os, time, threading, mimetypes

ALLOW = {
    'opensky-network.org', 'api.adsb.lol', 'api.airplanes.live', 'opendata.adsb.fi', 'api.adsbdb.com',
    'celestrak.org', 'tle.ivanstanojevic.me', 'earthquake.usgs.gov', 'eonet.gsfc.nasa.gov',
    'rata.digitraffic.fi', 'meri.digitraffic.fi', 'api.rainviewer.com',
    'overpass-api.de', 'overpass.kumi.systems', 'nominatim.openstreetmap.org',
    'api.open-meteo.com', 'geocoding-api.open-meteo.com',
    'de1.api.radio-browser.info', 'nl1.api.radio-browser.info', 'at1.api.radio-browser.info', 'all.api.radio-browser.info',
}
TTL = 6            # seconds a identical request is served from memory (protects the free APIs)
MAXBYTES = 25_000_000
CACHE, LOCK = {}, threading.Lock()
mimetypes.add_type('application/manifest+json', '.webmanifest')
mimetypes.add_type('text/javascript', '.js')


class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        u = urllib.parse.urlparse(newurl)
        if u.scheme != 'https' or (u.hostname or '').lower() not in ALLOW:
            raise urllib.error.URLError('redirect to a host that is not allowed')
        return super().redirect_request(req, fp, code, msg, headers, newurl)


OPENER = urllib.request.build_opener(SafeRedirect())


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        if '/proxy' in (args[0] if args else ''):
            return
        super().log_message(fmt, *args)

    def end_headers(self):
        if not self.path.startswith('/proxy'):
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_GET(self):
        if self.path.startswith('/proxy'):
            return self.proxy()
        return super().do_GET()

    def reply(self, status, body, ctype='text/plain; charset=utf-8'):
        if isinstance(body, str):
            body = body.encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def proxy(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        if 'ping' in q:
            return self.reply(200, 'zack-proxy')
        url = (q.get('url') or [''])[0]
        u = urllib.parse.urlparse(url)
        if u.scheme != 'https' or (u.hostname or '').lower() not in ALLOW:
            return self.reply(403, 'host not allowed')
        now = time.time()
        with LOCK:
            hit = CACHE.get(url)
            if hit and now - hit[0] < TTL:
                return self.reply(hit[1], hit[3], hit[2])
        req = urllib.request.Request(url, headers={
            'User-Agent': 'ZackEngine/1.0 (personal dashboard; contact: local)',
            'Accept': 'application/json,text/plain,*/*'})
        try:
            with OPENER.open(req, timeout=25) as r:
                data = r.read(MAXBYTES + 1)
                status, ctype = r.status, r.headers.get('Content-Type', 'application/octet-stream')
        except urllib.error.HTTPError as e:
            data, status, ctype = e.read(MAXBYTES), e.code, e.headers.get('Content-Type', 'text/plain')
        except Exception as e:
            return self.reply(502, 'upstream error: %s' % e)
        if len(data) > MAXBYTES:
            return self.reply(502, 'response too large')
        if status == 200:
            with LOCK:
                if len(CACHE) > 300:
                    CACHE.clear()
                CACHE[url] = (now, status, ctype, data)
        self.reply(status, data, ctype)


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == '__main__':
    port = 8000
    host = '127.0.0.1'
    for a in sys.argv[1:]:
        if a == '--lan':
            host = '0.0.0.0'
        elif a.isdigit():
            port = int(a)
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with Server((host, port), Handler) as s:
        print('Zack Engine: http://localhost:%d/index.html   (Ctrl+C to stop)' % port)
        if host == '0.0.0.0':
            print('LAN mode: other devices can open http://<this-computer-ip>:%d/index.html' % port)
        try:
            s.serve_forever()
        except KeyboardInterrupt:
            print('\nbye')
