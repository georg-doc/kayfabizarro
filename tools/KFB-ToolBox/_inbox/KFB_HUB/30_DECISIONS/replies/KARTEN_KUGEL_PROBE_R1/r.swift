import Foundation
import Quartz
let a=CommandLine.arguments
let doc=CGPDFDocument(URL(fileURLWithPath:a[1]) as CFURL)!
print("seiten",doc.numberOfPages)
let n=Int(a[2])!,W=Int(a[3])!
let p=doc.page(at:n)!
let b=p.getBoxRect(.mediaBox);print("box",b)
let H=Int(Double(W)*Double(b.height/b.width))
let c=CGContext(data:nil,width:W,height:H,bitsPerComponent:8,bytesPerRow:0,space:CGColorSpaceCreateDeviceRGB(),bitmapInfo:CGImageAlphaInfo.premultipliedLast.rawValue)!
c.setFillColor(CGColor(red:1,green:1,blue:1,alpha:1));c.fill(CGRect(x:0,y:0,width:W,height:H))
c.scaleBy(x:CGFloat(W)/b.width,y:CGFloat(H)/b.height);c.translateBy(x:-b.minX,y:-b.minY);c.drawPDFPage(p)
let d=CGImageDestinationCreateWithURL(URL(fileURLWithPath:a[4]) as CFURL,"public.png" as CFString,1,nil)!
CGImageDestinationAddImage(d,c.makeImage()!,nil);CGImageDestinationFinalize(d)
