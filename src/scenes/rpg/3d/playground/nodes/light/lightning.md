## Why the directional light wraps the camera.

Key observations:

1. The directional light has an OrthographicCamera as its shadow-camera
2. The shadow camera is nested inside the directional light
3. The shadow camera is configured with specific frustum dimensions

## Understanding Directional Light Shadow Camera

In Three.js and React Three Fiber, a directional light's shadow is rendered using an **orthographic camera** that defines the shadow mapping region. In this example, the shadow camera is deliberately configured to wrap around the scene:

### Shadow Camera Configuration

- **Left**: -22
- **Right**: 15
- **Top**: 10
- **Bottom**: -20

By nesting the `<OrthographicCamera>` inside the `<directionalLight>` with the `attach={"shadow-camera"}` prop, you're explicitly defining the shadow rendering frustum[1][3][4].

**Why This Matters:**

- The orthographic camera determines the **area where shadows will be calculated**
- Its dimensions control the shadow map's coverage
- Wider/larger dimensions mean more scene area will cast and receive shadows

### Best Practices

- Adjust the shadow camera's dimensions to match your scene's scale
- Ensure the shadow camera covers all objects that should cast or receive shadows
- Use larger `shadow-mapSize` values for more detailed shadows[4]

The wrapping effect you're seeing is intentional - it allows the directional light to cast shadows across a wide area of your scene, matching the orthographic camera's defined frustum.

## Prompt Instructions for LLM

You are a 3D lighting and React Three Fiber expert. Help me configure directional light and shadow camera for a scene with the following requirements:

Lighting Design Challenge:

- Create a realistic directional light setup for a 3D scene
- Configure shadow mapping to cover the entire scene accurately
- Optimize shadow quality and performance

Specific Technical Guidance Needed:

1. Explain the purpose of nesting an OrthographicCamera inside a directionalLight
2. Provide best practices for setting shadow camera frustum dimensions
3. Recommend optimal values for:
   - light intensity
   - shadow map size
   - shadow bias
   - camera frustum boundaries

Code Context Hints:

- Scene contains a complex 3D environment model
- Multiple objects need accurate shadow casting
- Performance is a consideration

Desired Output:

- Provide a complete React Three Fiber code snippet
- Include comments explaining each shadow and lighting parameter
- Suggest how to dynamically adjust shadow parameters based on scene complexity

Optimization Constraints:

- Keep shadow map resolution balanced
- Minimize performance overhead
- Ensure shadows look natural and crisp

Example Scenario:
Imagine lighting a large outdoor scene with architectural elements, where shadows need to be precise but not computationally expensive.
