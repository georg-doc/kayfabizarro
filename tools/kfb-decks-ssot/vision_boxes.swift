// Apple Vision: Textzeilen und Vordergrund je Bild, lokal, ohne Modellkosten.
// swift vision_boxes.swift <out.json> <bild1> <bild2> ...
// Ausgabe je Bild: text[{x,y,w,h,s}], fg[{x,y,w,h,area}] (Instanzen), salient[{x,y,w,h}] (Objektness); Anteile, Ursprung oben links.
import Foundation
import Vision
import CoreImage
import AppKit

func box(_ r: CGRect) -> [String: Double] { ["x": r.minX, "y": 1 - r.maxY, "w": r.width, "h": r.height] }
let a = CommandLine.arguments
var out: [String: Any] = [:]
var failedText = 0
for path in a[2...] {
    guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
    let h = VNImageRequestHandler(cgImage: cg)
    let t = VNRecognizeTextRequest(); t.recognitionLevel = .accurate; t.usesLanguageCorrection = false
    let o = VNGenerateObjectnessBasedSaliencyImageRequest()
    let f = VNGenerateForegroundInstanceMaskRequest()
    // Unter Speicherdruck schlägt die Texterkennung gelegentlich fehl: je Bild wiederholen, nie still schlucken
    var textOK = false
    for attempt in 0..<4 {
        do { try h.perform([t]); if !(t.results ?? []).isEmpty { textOK = true; break } } catch { }
        Thread.sleep(forTimeInterval: Double(attempt + 1) * 2)
    }
    if !textOK { failedText += 1 }
    try? h.perform([o])
    var fg: [[String: Double]] = []
    if (try? h.perform([f])) != nil, let res = f.results?.first {
        for inst in res.allInstances {
            if let m = try? res.generateScaledMaskForImage(forInstances: IndexSet(integer: inst), from: h) {
                CVPixelBufferLockBaseAddress(m, .readOnly)
                let W = CVPixelBufferGetWidth(m), H = CVPixelBufferGetHeight(m), bpr = CVPixelBufferGetBytesPerRow(m)
                let p = CVPixelBufferGetBaseAddress(m)!
                var x0 = W, x1 = 0, y0 = H, y1 = 0, n = 0
                let isFloat = CVPixelBufferGetPixelFormatType(m) == kCVPixelFormatType_OneComponent32Float
                for yy in stride(from: 0, to: H, by: 2) {
                    for xx in stride(from: 0, to: W, by: 2) {
                        let v: Float = isFloat ? p.advanced(by: yy * bpr + xx * 4).assumingMemoryBound(to: Float.self).pointee
                                               : Float(p.advanced(by: yy * bpr + xx).assumingMemoryBound(to: UInt8.self).pointee) / 255
                        if v > 0.5 { x0 = min(x0, xx); x1 = max(x1, xx); y0 = min(y0, yy); y1 = max(y1, yy); n += 1 }
                    }
                }
                CVPixelBufferUnlockBaseAddress(m, .readOnly)
                if n > 0 { fg.append(["x": Double(x0) / Double(W), "y": Double(y0) / Double(H), "w": Double(x1 - x0) / Double(W), "h": Double(y1 - y0) / Double(H), "area": Double(n * 4) / Double(W * H)]) }
            }
        }
    }
    let text: [[String: Any]] = (t.results ?? []).compactMap { r in
        guard let c = r.topCandidates(1).first else { return nil }
        var b: [String: Any] = box(r.boundingBox); b["s"] = c.string; return b
    }
    let sal: [[String: Double]] = (o.results?.first?.salientObjects ?? []).map { box($0.boundingBox) }
    out[(path as NSString).lastPathComponent] = ["text": text, "fg": fg, "salient": sal]
}
try JSONSerialization.data(withJSONObject: out, options: [.sortedKeys]).write(to: URL(fileURLWithPath: a[1]))
print("OK", out.count, "ohneText", failedText)
if failedText * 5 > out.count { FileHandle.standardError.write("Texterkennung fehlt bei \(failedText) Bildern\n".data(using: .utf8)!); exit(3) }
