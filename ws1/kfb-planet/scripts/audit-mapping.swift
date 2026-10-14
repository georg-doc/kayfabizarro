// Prüft den Kartenvertrag (Seite = coverOffset + 1 + floor((n-1)/4), Quadrant = (n-1) % 4) gegen das gedruckte PDF:
// rendert jede Kartenseite mit PDFKit (wie scripts/crop.swift), schneidet die vier Viertel und liest den Text mit
// Apple Vision. Ausgabe: JSON je Viertel mit erkanntem Text, für den Abgleich mit den Kartennamen (scripts/audit-mapping.py).
// Aufruf: swift scripts/audit-mapping.swift <pdf> <coverOffset> <cardCount>
import PDFKit
import AppKit
import Vision

let a = CommandLine.arguments
let doc = PDFDocument(url: URL(fileURLWithPath: a[1]))!
let off = Int(a[2])!, count = Int(a[3])!
var out: [[String: Any]] = []
let scale: CGFloat = 1.5
var pageNo = off + 1
while pageNo <= doc.pageCount {
  let p = doc.page(at: pageNo - 1)!
  let b = p.bounds(for: .mediaBox)
  let W = Int(b.width * scale), H = Int(b.height * scale)
  let img = NSImage(size: NSSize(width: W, height: H))
  img.lockFocus()
  NSColor.white.set(); NSRect(x: 0, y: 0, width: W, height: H).fill()
  let ctx = NSGraphicsContext.current!.cgContext
  ctx.scaleBy(x: scale, y: scale)
  p.draw(with: .mediaBox, to: ctx)
  img.unlockFocus()
  let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil)!
  for quad in 0..<4 {
    let n = (pageNo - off - 1) * 4 + quad + 1
    if n > count { break }
    let qx = quad % 2, qy = quad / 2
    let rect = CGRect(x: qx * cg.width / 2, y: qy * cg.height / 2, width: cg.width / 2, height: cg.height / 2)
    let crop = cg.cropping(to: rect)!
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = false
    try? VNImageRequestHandler(cgImage: crop, options: [:]).perform([req])
    // Zeilen von oben nach unten (Vision: y von unten)
    let lines = (req.results ?? []).sorted { $0.boundingBox.maxY > $1.boundingBox.maxY }.compactMap { $0.topCandidates(1).first?.string }
    out.append(["n": n, "page": pageNo, "quad": quad, "text": lines])
  }
  pageNo += 1
}
let data = try! JSONSerialization.data(withJSONObject: ["pdfPages": doc.pageCount, "cards": out], options: [])
FileHandle.standardOutput.write(data)
