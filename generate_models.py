"""
Script para generar modelos 3D simples en formato GLB
Crea casa, departamento y oficina básicas
"""

import struct
import json
import os

class GLBGenerator:
    """Genera archivos GLB simples para testing"""
    
    def __init__(self):
        self.vertices = []
        self.indices = []
        
    def add_box(self, x, y, z, width, height, depth):
        """Agrega una caja a los vértices"""
        start_idx = len(self.vertices)
        
        w, h, d = width/2, height/2, depth/2
        
        # 8 vértices de la caja
        vertices = [
            [x-w, y-h, z-d], [x+w, y-h, z-d],
            [x+w, y+h, z-d], [x-w, y+h, z-d],
            [x-w, y-h, z+d], [x+w, y-h, z+d],
            [x+w, y+h, z+d], [x-w, y+h, z+d],
        ]
        
        self.vertices.extend(vertices)
        
        # 12 triángulos (6 caras)
        faces = [
            [0,1,2], [0,2,3],  # Frente
            [4,6,5], [4,7,6],  # Atrás
            [0,4,5], [0,5,1],  # Abajo
            [2,6,7], [2,7,3],  # Arriba
            [0,3,7], [0,7,4],  # Izquierda
            [1,5,6], [1,6,2],  # Derecha
        ]
        
        for face in faces:
            self.indices.extend([start_idx + i for i in face])
    
    def create_casa(self):
        """Crea modelo de casa"""
        # Base
        self.add_box(0, 0.5, 0, 3, 1, 3)
        # Paredes
        self.add_box(0, 2, 0, 3, 3, 3)
        # Techo triangular
        self.add_box(0, 4, 0, 3, 0.5, 3)
        
    def create_depa(self):
        """Crea modelo de departamento"""
        # Torre base
        self.add_box(0, 2, 0, 2, 4, 2)
        # Balcón
        self.add_box(1.5, 2.5, 0, 0.8, 1, 2.5)
        
    def create_oficina(self):
        """Crea modelo de oficina"""
        # Estructura principal
        self.add_box(0, 1.5, 0, 3, 3, 2.5)
        # Columnas
        self.add_box(-1.3, 1, 0, 0.3, 2, 0.3)
        self.add_box(1.3, 1, 0, 0.3, 2, 0.3)
        
    def to_glb(self):
        """Convierte a formato GLB"""
        # Convertir a bytes
        vertices_bytes = b''.join([
            struct.pack('<fff', v[0], v[1], v[2]) 
            for v in self.vertices
        ])
        
        indices_bytes = b''.join([
            struct.pack('<I', i) for i in self.indices
        ])
        
        # Crear glTF JSON
        gltf = {
            "asset": {"version": "2.0"},
            "scene": 0,
            "scenes": [{"nodes": [0]}],
            "nodes": [{"mesh": 0}],
            "meshes": [{
                "primitives": [{
                    "attributes": {"POSITION": 0},
                    "indices": 1,
                    "mode": 4
                }]
            }],
            "accessors": [
                {
                    "bufferView": 0,
                    "componentType": 5126,
                    "count": len(self.vertices),
                    "type": "VEC3"
                },
                {
                    "bufferView": 1,
                    "componentType": 5125,
                    "count": len(self.indices),
                    "type": "SCALAR"
                }
            ],
            "bufferViews": [
                {"buffer": 0, "byteOffset": 0, "byteStride": 12},
                {"buffer": 0, "byteOffset": len(vertices_bytes)}
            ],
            "buffers": [{
                "byteLength": len(vertices_bytes) + len(indices_bytes)
            }]
        }
        
        json_str = json.dumps(gltf)
        json_bytes = json_str.encode('utf-8')
        
        # Padding
        json_padding = (4 - len(json_bytes) % 4) % 4
        json_bytes += b'\x20' * json_padding
        
        # GLB Header
        glb = struct.pack('<I', 0x46546C67)  # Magic
        glb += struct.pack('<I', 2)  # Version
        glb += struct.pack('<I', 28 + len(json_bytes) + len(vertices_bytes) + len(indices_bytes))
        glb += struct.pack('<I', len(json_bytes))
        glb += struct.pack('<I', 0x4E4F534A)  # JSON chunk type
        glb += json_bytes
        glb += struct.pack('<I', len(vertices_bytes) + len(indices_bytes))
        glb += struct.pack('<I', 0x004E4942)  # BIN chunk type
        glb += vertices_bytes + indices_bytes
        
        return glb

# Generar modelos
def generate_models():
    os.makedirs('public/models', exist_ok=True)
    
    # Casa
    gen = GLBGenerator()
    gen.create_casa()
    with open('public/models/casa.glb', 'wb') as f:
        f.write(gen.to_glb())
    print("✅ Modelo casa.glb creado")
    
    # Departamento
    gen = GLBGenerator()
    gen.create_depa()
    with open('public/models/depa.glb', 'wb') as f:
        f.write(gen.to_glb())
    print("✅ Modelo depa.glb creado")
    
    # Oficina
    gen = GLBGenerator()
    gen.create_oficina()
    with open('public/models/oficina.glb', 'wb') as f:
        f.write(gen.to_glb())
    print("✅ Modelo oficina.glb creado")

if __name__ == '__main__':
    generate_models()
