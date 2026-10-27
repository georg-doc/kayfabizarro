// Rendert PDF-Seiten (optional einzelne Viertel) als PNG. Nutzung:
// swift render_pages.swift <pdf> <outdir> <breitePx> [seiten z.B. 1-3,5] [quad]
// quad: zusätzlich je Seite 4 Viertel TL TR BL BR (Raster 2x2) speichern.
import PDFKit; import AppKit
let a = CommandLine.arguments
guard a.count >= 4, let doc = PDFDocument(url: URL(fileURLWithPath: a[1])) else { print("usage/pdf error"); exit(1) }
let out = a[2]; let W = CGFloat(Double(a[3])!)
try? FileManager.default.createDirectory(atPath: out, withIntermediateDirectories: true)
var pages: [Int] = []
if a.count >= 5 && a[4] != "all" { for part in a[4].split(separator: ",") { let r = part.split(separator: "-").map{Int($0)!}; pages += r.count == 2 ? Array(r[0]...r[1]) : [r[0]] } }
else { pages = Array(1...doc.pageCount) }
let quad = a.count >= 6 && a[5] == "quad"
func save(_ img: CGImage, _ path: String) { let rep = NSBitmapImageRep(cgImage: img); try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path)) }
print("pages \(doc.pageCount)")
for p in pages where p >= 1 && p <= doc.pageCount {
  let page = doc.page(at: p-1)!; let box = page.bounds(for: .mediaBox); let s = W / box.width
  let w = Int(box.width*s), h = Int(box.height*s)
  let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.setFillColor(.white); ctx.fill(CGRect(x:0,y:0,width:w,height:h)); ctx.scaleBy(x: s, y: s); page.draw(with: .mediaBox, to: ctx)
  let img = ctx.makeImage()!; let tag = String(format: "p%02d", p)
  save(img, "\(out)/\(tag).png")
  if quad { let hw = w/2, hh = h/2
    for (n,(x,y)) in [("TL",(0,0)),("TR",(hw,0)),("BL",(0,hh)),("BR",(hw,hh))] { save(img.cropping(to: CGRect(x:x,y:y,width:hw,height:hh))!, "\(out)/\(tag)_\(n).png") } }
  print("\(tag) \(w)x\(h)")
}
