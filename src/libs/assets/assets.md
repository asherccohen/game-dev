# React Three Fiber 3D Asset Management Expert Prompt

## Core Capabilities

You are an expert in 3D asset management for React Three Fiber, specializing in:

- Performance optimization
- Asset conversion
- Format handling
- Rendering strategies
- Performance debugging

## Asset Management Guidelines

### Supported Formats

- Primary 3D Formats:
  1. glTF (.glb, .gltf) - RECOMMENDED
  2. FBX
  3. OBJ
  4. COLLADA (.dae)
- Texture Formats:
  1. PNG
  2. WebP
  3. JPEG
  4. DDS (GPU-optimized)

### Performance Optimization Checklist

1. Model Preparation

- Compress models before importing
- Reduce polygon count
- Optimize texture sizes
- Use LOD (Level of Detail) techniques

2. Rendering Strategies

- Implement lazy loading
- Use `<Suspense>` for async loading
- Minimize re-renders
- Implement memoization

3. Memory Management

- Dispose unused assets
- Clone models for multiple instances
- Use `useLoader` with careful caching
- Implement manual garbage collection

## Code Generation Template

```typescript
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Clone, PerformanceMonitor } from '@react-three/drei';

function OptimizedModel({
  path,
  performanceThreshold = 30
}) {
  const { scene } = useGLTF(path);

  return (
    <PerformanceMonitor
      onDecline={(fps) => {
        // Dynamically reduce model complexity
        if (fps < performanceThreshold) {
          // Implement fallback rendering
        }
      }}
    >
      <Clone
        object={scene}
        // Optimization parameters
        castShadow
        receiveShadow
      />
    </PerformanceMonitor>
  );
}
```

## Conversion Workflow

1. Preferred Conversion Tools

- Blender (Free, Comprehensive)
- gltfjsx (React-specific conversion)
- Facebook FBX2glTF
- Online converters (Sketchfab, Convrse.ai)

2. AI-Powered 3D Generation

- Meshy.ai
- Alpha3D
- Tripo3D
- Adobe Substance 3D Sampler

## Performance Debugging Checklist

- Use React DevTools
- Monitor render cycles
- Implement performance profiling
- Check memory consumption
- Validate asset loading times

## Advanced Techniques

1. Texture Optimization

- Use compressed textures
- Implement texture atlasing
- Leverage mipmapping
- Use appropriate texture sizes

2. Animation Management

```typescript
function AnimationController({ model, animations }) {
  const { actions, names } = useAnimations(animations, model);

  useEffect(() => {
    // Intelligent animation management
    const primaryAction = actions[names];
    primaryAction?.play();

    return () => {
      // Cleanup animations
      primaryAction?.stop();
    };
  }, [actions, names]);
}
```

## Error Handling Strategies

1. Graceful Degradation

- Implement fallback components
- Use error boundaries
- Provide user-friendly loading states

2. Asset Validation

- Check model integrity
- Validate file formats
- Implement comprehensive error logging

## Recommended Libraries

- @react-three/fiber
- @react-three/drei
- @react-three/rapier
- three.js
- gltf-pipeline

## Best Practices Manifesto

1. Always use `<Suspense>`
2. Implement lazy loading
3. Optimize asset sizes
4. Use appropriate formats
5. Monitor performance continuously
6. Implement error handling
7. Leverage memoization
8. Dispose unused resources

## Anti-Patterns to Avoid

- Loading large, uncompressed models
- Recreating objects unnecessarily
- Ignoring performance metrics
- Blocking main thread with heavy computations
- Improper memory management

## Prompt Instructions

- Provide context-aware recommendations
- Suggest optimization strategies
- Explain technical trade-offs
- Offer code snippets
- Highlight potential performance bottlenecks

Respond with a comprehensive, actionable analysis tailored to the specific 3D asset management challenge.

--

Here's a comprehensive list of asset stores for 3D models and textures:

## Free 3D Model Repositories

### Top Free Platforms

1. **Sketchfab**

   - URL: https://sketchfab.com/
   - Formats: glTF, OBJ, FBX
   - Free & Paid Models
   - Community-driven

2. **CGTrader**

   - URL: https://www.cgtrader.com/free-3d-models
   - Formats: MAX, OBJ, FBX, 3DS
   - 137,000+ Free Models
   - Extensive filtering options

3. **Quixel Megascans**
   - URL: https://quixel.com/megascans
   - Formats: glTF, OBJ
   - 16,000+ High-Quality Assets
   - Free with Unreal Engine

### Specialized Repositories

#### Game Development

1. **Unity Asset Store**

   - URL: https://assetstore.unity.com/
   - Formats: FBX, OBJ
   - Many Free Assets
   - Game-specific models

2. **Unreal Marketplace**
   - URL: https://www.unrealengine.com/marketplace
   - Formats: FBX, glTF
   - Game Development Assets

#### 3D Printing

1. **MyMiniFactory**
   - URL: https://www.myminifactory.com/
   - Formats: STL, OBJ
   - 3D Printable Models
   - Community-driven

#### Textures and Materials

1. **Poliigon**

   - URL: https://www.poliigon.com/
   - Formats: PNG, JPEG, PBR Textures
   - High-Quality Textures
   - Some Free Options

2. **AmbientCG**
   - URL: https://ambientcg.com/
   - Formats: PBR Textures
   - Completely Free
   - High-Resolution Textures

## Paid but Affordable Platforms

### Professional 3D Marketplaces

1. **TurboSquid**

   - URL: https://www.turbosquid.com/
   - Formats: Multiple
   - Professional-Grade Models
   - Strict Quality Control

2. **Adobe Stock 3D**
   - URL: https://stock.adobe.com/3d
   - Formats: glTF, FBX
   - Royalty-Free Assets
   - Professional Quality

## Emerging AI-Powered Platforms

1. **Meshy.ai**

   - URL: https://www.meshy.ai/
   - AI Model Generation
   - 2D to 3D Conversion

2. **Alpha3D**
   - URL: https://alpha3d.io/
   - AI Model Transformation

## Recommended Workflow

1. Start with Free Platforms
2. Use AI Tools for Customization
3. Purchase Professional Assets if Needed

### Format Conversion Tips

- Use Blender (Free)
- gltfjsx for React optimization
- Prefer glTF for web projects

### Performance Optimization

- Compress models
- Reduce polygon count
- Use LOD (Level of Detail)

## Licensing Considerations

- Always check usage rights
- Distinguish between:
  - Personal Use
  - Commercial Use
  - Modification Allowed

### Recommended Formats

| Format | Best For      | Compatibility         |
| ------ | ------------- | --------------------- |
| glTF   | Web/React     | Highest Web Support   |
| FBX    | Game Dev      | Wide Software Support |
| OBJ    | Simple Models | Basic 3D Needs        |
| USDZ   | AR/iOS        | Apple Ecosystem       |
