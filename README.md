# interactive-fragment-shader

It's a really **tiny** "tool" to visualize 2D fragment shader algorithms.

**Personal warning:**


> I would not touch it yet, as I was also a bit shocked by my code, after one year. Maybe I clean it up soon.


### What it does

it just shows what the fragment shader code is doing pixel for pixel.

### It helps ...
* ... to understand how to handle the fact that pixels are rendered parallel and independent from each other.
* ... to understand that a shader code is just responsible for rendering ONE color value.
Depending on the input texture coordinates, it results to different colors in different pixels.
* ... to debug logical mistakes, as a real shader is very hard to debug.

### Set up

* no `npm`, no installation, no webserver required
* clone, write your effect in `js/PP_Effects.js`, delete preset effects, if they disturb
* adjust in `index.html`: `var effect = PP.Effect.your_effect();` with `your_effect` = the name of your effect
* adjust the pixel dimensions (`index.html`): in `PP.inGrid` and `PP.outGrid`
* adjust the start/test "texture" (`js/PP_Grids.js`).

### How to write shader effects

**It's no shading language (glsl, HLSL, Cg, ...), just Vanilla JS, as it's for teaching and demo purposes!**

* I explain it as soon, as I get an overview by myself of my own old code :D

### Why?

I don't know if it really helps someone.
I wrote it down in one day one year ago, just because I had problems to understand how to realize some effects as fragment shaders.
It helped me to understand better the fragment shader, and now I needed it again, so I created a public Repo out of it.

### License

See the [LICENSE](./LICENSE.txt) file for license rights and limitations (MIT).