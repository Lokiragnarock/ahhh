# Dump a .docx as paragraphs, keeping super/subscript as ^{..} _{..},
# bold as **..**, and images as [IMG:media/name].
import sys, zipfile, re
import xml.etree.ElementTree as ET
W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
A='{http://schemas.openxmlformats.org/drawingml/2006/main}'
z=zipfile.ZipFile(sys.argv[1])
rels={}
for r in ET.fromstring(z.read('word/_rels/document.xml.rels')):
    rels[r.get('Id')]=r.get('Target')
root=ET.fromstring(z.read('word/document.xml'))
body=root.find(W+'body')
def para(p):
    out=''
    for r in p.iter():
        if r.tag==W+'r':
            rp=r.find(W+'rPr'); va=None; b=False
            if rp is not None:
                v=rp.find(W+'vertAlign'); va=v.get(W+'val') if v is not None else None
                b=rp.find(W+'b') is not None
            t=''.join((x.text or '') if x.tag==W+'t' else ('\t' if x.tag==W+'tab' else '') for x in r)
            for bl in r.iter(A+'blip'):
                out+=f"[IMG:{rels.get(bl.get(R+'embed'))}]"
            for d in r.iter('{urn:schemas-microsoft-com:vml}imagedata'):
                out+=f"[IMG:{rels.get(d.get(R+'id'))}]"
            if not t: continue
            if va=='superscript': t='^{'+t+'}'
            elif va=='subscript': t='_{'+t+'}'
            out+=t
    return out
for el in body:
    if el.tag==W+'p':
        s=para(el)
        if s.strip(): print(s)
    elif el.tag==W+'tbl':
        for tr in el.iter(W+'tr'):
            cells=[' '.join(para(p) for p in tc.iter(W+'p')).strip() for tc in tr.iter(W+'tc')]
            print('| '+' | '.join(cells)+' |')
