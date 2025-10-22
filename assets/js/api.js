// Zentraler API-Wrapper mit echtem Fehlertext, 204-Handling und robustem Update
export const API = {
  base: 'https://projects.sbw.media',

  async _parseOrText(res) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) { try { return await res.json(); } catch {} }
    try { return await res.text(); } catch { return null; }
  },
  _toErrStr(body){ if(body==null) return ''; if(typeof body==='string') return body; try{return JSON.stringify(body);}catch{return String(body);} },

  async get(endpoint){
    const res = await fetch(`${this.base}/${endpoint}`);
    if (res.status===204) return [];
    if (!res.ok) { const msg=this._toErrStr(await this._parseOrText(res)); throw new Error(`GET ${endpoint} → ${res.status}: ${msg}`); }
    const data = await this._parseOrText(res);
    return (data && data.resources) ? data.resources : data;
  },

  async getOne(endpointWithId){
    const res = await fetch(`${this.base}/${endpointWithId}`);
    if (res.status===204 || !res.ok) return null;
    try { return await res.json(); } catch { return null; }
  },

  async post(endpoint, payload){
    const res = await fetch(`${this.base}/${endpoint}`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if (!res.ok){ const msg=this._toErrStr(await this._parseOrText(res)); throw new Error(`POST ${endpoint} → ${res.status}: ${msg}`); }
    return this._parseOrText(res);
  },

  // Robustes Update: zuerst PUT, bei Fehler POST (laut deiner Doku)
  async updateSmart(endpointWithId, payload){
    let res = await fetch(`${this.base}/${endpointWithId}`, {
      method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if (!res.ok){
      res = await fetch(`${this.base}/${endpointWithId}`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
      });
    }
    if (!res.ok){ const msg=this._toErrStr(await this._parseOrText(res)); throw new Error(`UPDATE ${endpointWithId} → ${res.status}: ${msg}`); }
    return this._parseOrText(res);
  },

  async del(endpointWithId){
    const res = await fetch(`${this.base}/${endpointWithId}`, { method:'DELETE' });
    if (!res.ok){ const msg=this._toErrStr(await this._parseOrText(res)); throw new Error(`DELETE ${endpointWithId} → ${res.status}: ${msg}`); }
    try { return await res.json(); } catch { return { ok:true }; }
  }
};
