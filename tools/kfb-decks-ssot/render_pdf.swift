// Render PDF pages or page regions to PNG with PDFKit (no extra installs).
// Usage: swift render_pdf.swift <pdf> <jobs.json>
// jobs.json: [{"page":1,"rect":[x,y,w,h],"out":"a.png","width":1600}]
//   page is 1-based, rect is a fraction of the page with origin top-left
//   ([0,0,1,1] = whole page), width is the output width in px.
import Foundation
import PDFKit
import AppKit

struct Job: Decodable { let page: Int; let rect: [Double]; let out: String; let width: Double }

let args = CommandLine.arguments
guard args.count == 3, let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
    FileHandle.standardError.write("usage: render_pdf.swift <pdf> <jobs.json>\n".data(using: .utf8)!); exit(2)
}
let jobs = try JSONDecoder().decode([Job].self, from: Data(contentsOf: URL(fileURLWithPath: args[2])))
var failed = 0
for job in jobs {
    guard let page = doc.page(at: job.page - 1) else { print("FAIL page \(job.page) missing"); failed += 1; continue }
    let box = page.bounds(for: .cropBox)
    let r = job.rect
    // PDF space has origin bottom-left; rect fractions are top-left based.
    let src = CGRect(x: box.minX + r[0] * box.width,
                     y: box.minY + (1 - r[1] - r[3]) * box.height,
                     width: r[2] * box.width, height: r[3] * box.height)
    let scale = job.width / src.width
    let w = Int(src.width * scale), h = Int(src.height * scale)
    guard let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0,
                              space: CGColorSpace(name: CGColorSpace.sRGB)!,
                              bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { failed += 1; continue }
    ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
    ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
    ctx.interpolationQuality = .high
    ctx.scaleBy(x: scale, y: scale)
    ctx.translateBy(x: -src.minX, y: -src.minY)
    page.draw(with: .cropBox, to: ctx)
    guard let img = ctx.makeImage(),
          let png = NSBitmapImageRep(cgImage: img).representation(using: .png, properties: [:]) else { failed += 1; continue }
    try png.write(to: URL(fileURLWithPath: job.out))
    print("OK \(job.out) \(w)x\(h)")
}
exit(failed == 0 ? 0 : 1)
