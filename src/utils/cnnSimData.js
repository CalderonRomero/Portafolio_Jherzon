// Samples metadata for CNN Visualizer (Rediseño Científico PlantAndes)
// SVGs are drawn inline in code for absolute vector clarity.

export const cnnModels = [
  {
    id: 'crops',
    title: 'PlantAndes (Cultivos Andinos)',
    description: 'Diagnóstico automatizado de patologías foliares en comunidades altoandinas de Cusco mediante PyTorch.',
    accuracy: '90.2%',
    metric: 'Validación Cruzada: 90.2% Acc (Dataset de 39 clases)',
    layers: [
      { name: 'Capa de Entrada', type: 'image', size: '224x224x3' },
      { name: 'Conv2D + BatchNorm', type: 'conv', size: '222x222x32', kernels: 32 },
      { name: 'MaxPooling2D', type: 'pool', size: '111x111x32' },
      { name: 'Conv2D + ReLU', type: 'conv', size: '109x109x64', kernels: 64 },
      { name: 'MaxPooling2D', type: 'pool', size: '54x54x64' },
      { name: 'Dense (Softmax)', type: 'dense', size: '39' }
    ],
    samples: [
      {
        id: 'leaf-healthy',
        name: 'Hoja de Papa Sana',
        type: 'healthy-leaf',
        description: 'Tejido foliar andino sin necrosis ni decoloración celular.',
        svgPath: 'healthy-leaf',
        qualityPass: true,
        expectedOutput: [
          { label: 'Saludable', value: 96 },
          { label: 'Tizón Tardío', value: 3 },
          { label: 'Mildiu de Quinua', value: 1 }
        ]
      },
      {
        id: 'leaf-tizon',
        name: 'Papa con Tizón Tardío',
        type: 'tizon-leaf',
        description: 'Muestra infectada con Phytophthora infestans, mostrando manchas necróticas húmedas.',
        svgPath: 'rust-leaf',
        qualityPass: true,
        expectedOutput: [
          { label: 'Tizón Tardío (Phytophthora)', value: 93 },
          { label: 'Saludable', value: 4 },
          { label: 'Mildiu de Quinua', value: 3 }
        ]
      },
      {
        id: 'leaf-mildiu',
        name: 'Quinua con Mildiu',
        type: 'mildiu-leaf',
        description: 'Presencia del hongo Peronospora variabilis con clorosis e invasión polvorienta en el envés.',
        svgPath: 'mildew-leaf',
        qualityPass: true,
        expectedOutput: [
          { label: 'Mildiu (Peronospora)', value: 91 },
          { label: 'Tizón Tardío', value: 6 },
          { label: 'Saludable', value: 3 }
        ]
      },
      {
        id: 'leaf-blurry',
        name: 'Muestra Borrosa (Falla Filtro)',
        type: 'blurry-leaf',
        description: 'Imagen fuera de foco tomada en campo. No pasa la prueba de nitidez laplaciana.',
        svgPath: 'blurry-image',
        qualityPass: false,
        expectedOutput: []
      }
    ]
  },
  {
    id: 'melanoma',
    title: 'Detección de Melanoma',
    description: 'Diagnóstico precoz de lesiones cutáneas oncológicas mediante regularización por Dropout.',
    accuracy: '91.8%',
    metric: 'Validación en Test: 91.8% Acc (Model ResNet-50)',
    layers: [
      { name: 'Capa de Entrada', type: 'image', size: '224x224x3' },
      { name: 'Conv2D + BatchNorm', type: 'conv', size: '222x222x64', kernels: 64 },
      { name: 'MaxPooling2D', type: 'pool', size: '111x111x64' },
      { name: 'Conv2D + Dropout', type: 'conv', size: '109x109x128', kernels: 128 },
      { name: 'MaxPooling2D', type: 'pool', size: '54x54x128' },
      { name: 'Dense (Softmax)', type: 'dense', size: '2' }
    ],
    samples: [
      {
        id: 'melanoma-benign',
        name: 'Nevus Benigno',
        type: 'benign',
        description: 'Lunar simétrico, de bordes regulares y coloración uniforme.',
        svgPath: 'benign-nevus',
        qualityPass: true,
        expectedOutput: [
          { label: 'Benigno', value: 97 },
          { label: 'Maligno (Melanoma)', value: 3 }
        ]
      },
      {
        id: 'melanoma-malignant',
        name: 'Melanoma Detectado',
        type: 'malignant',
        description: 'Lesión epidérmica asimétrica, con bordes difusos y policromía activa.',
        svgPath: 'malignant-melanoma',
        qualityPass: true,
        expectedOutput: [
          { label: 'Maligno (Melanoma)', value: 94 },
          { label: 'Benigno', value: 6 }
        ]
      }
    ]
  },
  {
    id: 'caries',
    title: 'Diagnóstico de Caries',
    description: 'Análisis automatizado de radiografías bitewing dentales para detección de caries incipientes.',
    accuracy: '80.5%',
    metric: 'Validación: 80.5% Acc (Red Conv2D ligera)',
    layers: [
      { name: 'Capa de Entrada', type: 'image', size: '150x150x1' },
      { name: 'Conv2D + ReLU', type: 'conv', size: '148x148x16', kernels: 16 },
      { name: 'MaxPooling2D', type: 'pool', size: '74x74x16' },
      { name: 'Conv2D', type: 'conv', size: '72x72x32', kernels: 32 },
      { name: 'MaxPooling2D', type: 'pool', size: '36x36x32' },
      { name: 'Dense (Softmax)', type: 'dense', size: '2' }
    ],
    samples: [
      {
        id: 'caries-healthy',
        name: 'Pieza Dental Sana',
        type: 'healthy-tooth',
        description: 'Radiografía de esmalte coronal continuo y dentina intacta.',
        svgPath: 'healthy-tooth',
        qualityPass: true,
        expectedOutput: [
          { label: 'Sano', value: 89 },
          { label: 'Caries Detectada', value: 11 }
        ]
      },
      {
        id: 'caries-active',
        name: 'Caries Coronaria Activa',
        type: 'active-caries',
        description: 'Zona de desmineralización radiolúcida (sombra) que invade el esmalte.',
        svgPath: 'caries-tooth',
        qualityPass: true,
        expectedOutput: [
          { label: 'Caries Detectada', value: 85 },
          { label: 'Sano', value: 15 }
        ]
      }
    ]
  }
];
