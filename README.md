# SliderJS

SliderJS is a lightweight, responsive library designed for creating dynamic sliders. 
It offers smooth transitions and customizable settings while being accessible (a11y), ensuring an inclusive experience for all users. 
Perfect for enhancing usability and user experience.

# How to use

### 1. Include the Required Files
Make sure to include SliderJS in your project.

```html
<script type="module" src="dist/js/sliderjs.min.js"></script>
```

### 2. Initialize the SliderJS
After including the required files, add the following HTML structure to create the slider:

```html
<div class="sliderjs">
    <div class="sliderjs-inner">
        <div class="sliderjs-item">
            <img src="https://4kwallpapers.com/images/wallpapers/ghost-of-yotei-game-3840x2160-19048.jpg" alt="Obrazek 1">
            <div class="sliderjs-caption">
                <h2>Title</h2>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
        </div>
        <div class="sliderjs-item">
            <img src="https://4kwallpapers.com/images/wallpapers/ghost-of-yotei-game-3840x2160-19048.jpg" alt="Obrazek 2">
            <div class="sliderjs-caption">
                <h2>Title</h2>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
        </div>
        <div class="sliderjs-item">
            <img src="https://4kwallpapers.com/images/wallpapers/ghost-of-yotei-game-3840x2160-19048.jpg" alt="Obrazek 3">
            <div class="sliderjs-caption">
                <h2>Title</h2>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
        </div>
        <div class="sliderjs-item">
            <img src="https://4kwallpapers.com/images/wallpapers/ghost-of-yotei-game-3840x2160-19048.jpg" alt="Obrazek 3">
            <div class="sliderjs-caption">
                <h2>Title</h2>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
        </div>
    </div>
</div>
```

### 3. Optional Configuration
You can customize the slider using the following attributes:

```html
<div class="sliderjs" 
     data-speed="1000" 
     data-autoplay="false" 
     data-loop="false" 
     data-nav="false" 
     data-dots="false" 
     data-counter="false" 
     data-control="false" 
     data-overlay="true">
</div>
```

## Website

Check out the https://ruciloss.github.io

## License

Distributed under the **MIT** License. See [LICENSE](https://opensource.org/license/mit) for more information.

---

Copyright © Ruciloss
