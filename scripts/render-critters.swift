// Renders the four animals from the app's animal_idle.usdz into transparent PNGs, front on, with the idle animation a moment in.
// It uses an ARView (RealityKit's own renderer, like the app) because the animals are skinned and only look right once the clip plays.
//
//   swiftc -O -parse-as-library scripts/render-critters.swift -o /tmp/render-critters
//   /tmp/render-critters path/to/Lookie/Resources/characters/animal_idle.usdz /tmp/critters
//   node scripts/finish-critters.mjs /tmp/critters
import AppKit
import Foundation
import RealityKit

struct Animal {
    let file: String
    let root: String
    let others: [String]
    let yaw: Float
}

let animals = [
    Animal(file: "kepik", root: "LB_Rig", others: ["BF_Root", "Bee_Root", "SN_Rig"], yaw: 0),
    Animal(file: "kupu", root: "BF_Root", others: ["LB_Rig", "Bee_Root", "SN_Rig"], yaw: 0),
    Animal(file: "lebah", root: "Bee_Root", others: ["LB_Rig", "BF_Root", "SN_Rig"], yaw: 0),
    // Turned a little so the green shell on its back shows.
    Animal(file: "siput", root: "SN_Rig", others: ["LB_Rig", "BF_Root", "Bee_Root"], yaw: 0.55),
]

@main struct Main {
    @MainActor static func main() async throws {
        let args = CommandLine.arguments
        guard args.count >= 3 else { fatalError("usage: render-critters <animal_idle.usdz> <out dir>") }
        let usdz = URL(fileURLWithPath: args[1])
        let out = args[2]
        try FileManager.default.createDirectory(atPath: out, withIntermediateDirectories: true)

        NSApplication.shared.setActivationPolicy(.accessory)
        let size: CGFloat = 1024
        let arView = ARView(frame: CGRect(x: 0, y: 0, width: size, height: size))
        arView.environment.background = .color(.clear)
        let window = NSWindow(contentRect: CGRect(x: 0, y: 0, width: size, height: size), styleMask: [.borderless], backing: .buffered, defer: false)
        window.isOpaque = false
        window.backgroundColor = .clear
        window.contentView = arView
        window.setFrameOrigin(NSPoint(x: 100, y: 100))
        window.orderFrontRegardless()

        for a in animals {
            let scene = try await Entity(contentsOf: usdz)
            for o in a.others { scene.findEntity(named: o)?.removeFromParent() }
            guard let root = scene.findEntity(named: a.root) else { fatalError(a.root) }
            root.orientation = simd_quatf(angle: a.yaw, axis: [0, 1, 0]) * root.orientation

            let anchor = AnchorEntity(world: .zero)
            anchor.addChild(scene)
            arView.scene.addAnchor(anchor)

            let bounds = root.visualBounds(relativeTo: nil)
            let fov: Float = 12
            let extent = max(bounds.extents.x, bounds.extents.y)
            let distance = (extent * 0.62) / tan(fov * .pi / 360) + bounds.extents.z
            let camera = Entity()
            camera.components.set(PerspectiveCameraComponent(near: 0.05, far: 500, fieldOfViewInDegrees: fov))
            camera.position = [bounds.center.x, bounds.center.y, bounds.center.z + distance]
            anchor.addChild(camera)
            let sun = Entity()
            sun.components.set(DirectionalLightComponent(color: .white, intensity: 2600, isRealWorldProxy: false))
            sun.look(at: [0, 0, 0], from: [-3, 5, 6], relativeTo: nil)
            anchor.addChild(sun)

            if let clip = root.availableAnimations.first(where: { $0.name == "default subtree animation" }) {
                root.playAnimation(clip.repeat(), transitionDuration: 0, startsPaused: false)
            }
            try await Task.sleep(nanoseconds: 1_200_000_000)
            await withCheckedContinuation { (cont: CheckedContinuation<Void, Never>) in
                arView.snapshot(saveToHDR: false) { image in
                    if let image, let tiff = image.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
                       let png = rep.representation(using: .png, properties: [:]) {
                        try? png.write(to: URL(fileURLWithPath: "\(out)/\(a.file).png"))
                    } else {
                        print("no snapshot for \(a.file)")
                    }
                    cont.resume()
                }
            }
            arView.scene.removeAnchor(anchor)
            print("rendered \(a.file)")
        }
    }
}
