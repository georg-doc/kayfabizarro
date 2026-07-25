# KFB TinySkies Transfer Audit v2

## Executive Summary

TinySkies ist für die KFB Engine weniger als Spielvorlage interessant, sondern als Referenz für
eine saubere Runtime-Architektur. Besonders wertvoll sind:

- Quaternion-/Tangent-Frame-Movement auf einer Kugel
- Entkopplung von Movement, Camera und Vehicle
- Parametergetriebenes Game Feel statt komplexer Physik
- Kleine, klar abgegrenzte Runtime-Module

## KISS-Cluster

### 1. Movement Core (Übernehmen)
- Quaternion-basierte Positionsrepräsentation
- Tangent Frame (up / north / east)
- Altitude getrennt von Surface-Position
- Parameter statt Physiksimulation

### 2. Camera Rig (Übernehmen + Anpassen)
- Follow Camera
- Smooth Damping
- Dynamic FOV
- Look-Ahead
- Camera Shake als separates Modul

Für KFB zusätzlich:
- Pet Focus
- Card Focus
- Cinematic Events

### 3. Vehicle Layer (Anpassen)

TinySkies:
Plane -> Flight

KFB:
Pet -> Vehicle -> Controller

Vehicle:
- Card
- Boat
- Balloon
- Dragon
- Train

### 4. World Layer (Selektiv übernehmen)

Übernehmen:
- Ambient NPCs
- Landmarks
- Wetter
- Kleine Events

Nicht übernehmen:
- Monolithische Game-Klasse

## Transfer Matrix

| TinySkies | KFB |
|-----------|-----|
| Plane | CardVehicle |
| FlightControls | FlightController |
| CameraRig | CameraRig |
| SphericalMath | SurfaceMath |
| Globe | SurfaceRuntime |
| Game | TravelRuntime |

## Claude-Modulvorschlag

Sprint 1
- TravelRuntime
- TravelState

Sprint 2
- VehicleContract
- CardRig

Sprint 3
- GroundController
- FlightController

Sprint 4
- CameraRig
- VehicleFX

Sprint 5
- AmbientWorld
- Events
- Navigation

## Dinge, die KFB bewusst anders machen sollte

- Kein God-Object
- Keine Gameplay-Logik in der Camera
- Keine Gameplay-Logik im CardRig
- Kleine Module mit klarer Ownership
- Contracts als First-Class-Konzept

## Empfehlung

TinySkies sollte nicht kopiert werden.

Übernommen werden sollten:
- Runtime-Prinzipien
- Bewegungsmodell
- Kamerakonzept
- Modulgrenzen

Die eigentliche KFB Engine sollte daraus eine generische Travel Runtime entwickeln,
auf der Ground, Flight und zukünftige Vehicles gleichermaßen aufbauen.
