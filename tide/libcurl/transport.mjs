/* The transport Tide actually loads.
 *
 * bare-mux hands a transport its headers as a plain object, while libcurl
 * walks them like a list:
 *
 *   for (let [key, value] of headers) ...
 *
 * A plain object cannot be walked that way, so every request died with
 * "headers is not iterable" before it left the browser. This turns whatever
 * it is handed into a list of pairs first and then lets libcurl get on with
 * it. Anything already walkable - a Headers object, an array of pairs - is
 * passed straight through, so this keeps working if bare-mux changes its
 * mind later.
 */
import LibcurlClient from "./index.mjs";

const pairs = h => (h && typeof h[Symbol.iterator] === "function") ? h : Object.entries(h || {});

class TideTransport extends LibcurlClient {
  request(remote, method, body, headers, signal){
    return super.request(remote, method, body, pairs(headers), signal);
  }
  connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror){
    return super.connect(url, protocols, pairs(requestHeaders), onopen, onmessage, onclose, onerror);
  }
}

export { TideTransport, TideTransport as LibcurlClient, TideTransport as default };
