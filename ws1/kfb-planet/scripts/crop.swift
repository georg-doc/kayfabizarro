import PDFKit
import AppKit
let a = CommandLine.arguments
let doc = PDFDocument(url: URL(fileURLWithPath: a[1]))!
let pageNo = Int(a[2])!, quad = Int(a[3])!
print("pdfPages", doc.pageCount)
let p = doc.page(at: pageNo - 1)!
let b = p.bounds(for: .mediaBox)
let scale: CGFloat = 2
let W = Int(b.width * scale), H = Int(b.height * scale)
let img = NSImage(size: NSSize(width: W, height: H))
img.lockFocus()
NSColor.white.set(); NSRect(x: 0, y: 0, width: W, height: H).fill()
let ctx = NSGraphicsContext.current!.cgContext
ctx.scaleBy(x: scale, y: scale)
p.draw(with: .mediaBox, to: ctx)
img.unlockFocus()
let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil)!
let qx = quad % 2, qy = quad / 2
let rect = CGRect(x: qx * cg.width / 2, y: qy * cg.height / 2, width: cg.width / 2, height: cg.height / 2)
let crop = cg.cropping(to: rect)!
let rep = NSBitmapImageRep(cgImage: crop)
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[4]))
print("page", pageNo, "pt", b.width, b.height, "crop px", rect)
