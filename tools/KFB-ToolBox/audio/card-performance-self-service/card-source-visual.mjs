// Reuses the current KFB Card Builder's PDF.js donor version and page mapping.
// Full original page is shown when no measured Card crop exists; no guessed crop.
const PDFJS='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs';
const WORKER='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';
const docs=new Map();let library;
export async function originalCardPage({repo,ref,path,cardNumber,coverOffset},canvas){
  const metadata=await fetch(`https://api.github.com/repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(ref)}`,{cache:'no-store'});
  if(!metadata.ok)throw Error('ORIGINAL_PDF_METADATA_UNAVAILABLE');const file=await metadata.json();
  let doc=docs.get(file.sha);
  if(!doc){const response=await fetch(file.download_url,{cache:'no-store'});if(!response.ok)throw Error('ORIGINAL_PDF_UNAVAILABLE');const bytes=new Uint8Array(await response.arrayBuffer());
    const header=new TextEncoder().encode(`blob ${bytes.length}\0`),joined=new Uint8Array(header.length+bytes.length);joined.set(header);joined.set(bytes,header.length);
    const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-1',joined))].map(b=>b.toString(16).padStart(2,'0')).join('');
    if(hash!==file.sha)throw Error('ORIGINAL_PDF_REVISION_CONFLICT');
    library??=await import(PDFJS);library.GlobalWorkerOptions.workerSrc=WORKER;doc=await library.getDocument({data:bytes}).promise;docs.set(file.sha,doc);
  }
  const pageNumber=coverOffset+1+Math.floor((cardNumber-1)/4),page=await doc.getPage(pageNumber),viewport=page.getViewport({scale:720/page.getViewport({scale:1}).width});
  canvas.width=viewport.width;canvas.height=viewport.height;await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
  return {pdfRevision:file.sha,page:pageNumber,quadrant:['TL','TR','BL','BR'][(cardNumber-1)%4],status:'ORIGINAL_PDF_PAGE_VERIFIED_EXACT_CROP_PENDING'};
}
