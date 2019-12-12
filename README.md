# vue-app


## Question

What is the difference between these expressions?
+ ```:class="[inStock ? textDecoration : '']"```
+ ```:class="{ disabledButton: !inStock }"```

## Answer

### ```:class="[inStock ? textDecoration : '']"```

conditional logic with an iternary operator: since inStock is true the textDecoration class will be added, in case inStock is false nothing will be added

### ```:class="{ disabledButton: !inStock }"```

disabledButton is the name of the class that will be added whenever inStock is not true

## Notes

------
### General Binding

`v-bind:class``` in short ```:class`

`v-bind:style``` in short ```:style`

`v-bind:disabled``` in short ```:disabled` 

------
### Image

index.html:
```html
<img v-bind:src="image" v-bind:alt="altText" v-bind:title="toolTip">
```
main.js:
```javascript
data: {
  image: './img/blumen-pink.jpg',
  altText: "Bouquet of pink and white flowers",
  toolTip: "Bouquet of pink and white flowers",
}
```

------
### List

index.html
```html
<h1>{{ title }}</h1>
<p>{{ description }}</p>
<ul>
  <li v-for="detail in details">{{ detail }}</>
</ul>
```

main.js
```javascript
description: 'Bouquet of flowers perfect for speacial occasions or as an everyday gift.',
details: ["1 white Lily", "5 white Carnations", "2 pink Gerbera Daisys", "6 pink Carnations", "Complementary greens"]
```

------
### Button

```html
<button v-on:click="addToCart" :disabled="!inStock" :class="{ 'button:disabled': !inStock }">Add to Cart</button>
```

`v-on:click="addToCart"` --> calls the addToCart function in the js file when the button gets clicked

`:disabled="!inStock"` --> disable the button if inStock is false

`:class="{ 'button:disabled': !inStock }"` --> this adds the css class button:disabled to the button whenever inStock is not true.

```html
<button v-show="cart >= 1" v-on:click="removeFromCart" >Remove from Cart</button>
```

`v-show="cart >= 1"` -> show the button when the condition is true

------
### Array

```html
<div v-for="variant in variants" v-bind:key="variant.variantId" class="color-box" v-bind:style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct( variant.variantImage, variant.variantDetails, variant.variantAltText, variant.variantToolTip )"> </div>
```

`v-for="variant in variants"` -> iterate through array in data

`v-bind:key="variant.variantId"` -> get the key id out of the array

`v-bind:style="{ backgroundColor: variant.variantColor }"` -> Style Binding, `{ backgroundColor:` refers to the CSS property that will be added, `variant.variantColor }"` the one on the right is referencing to the color in the data. The expression evaluates to the inline style: `style="background-color: MediumVioletRed"`.

Because it is an Object here camel casing is used `v-bind:style="{ backgroundColor: variant.variantColor }"` but if prefered it can also be written like in css as long as single quotes are used `v-bind:style="{ 'background-color': variant.variantColor }"`


`@mouseover="updateProduct( variant.variantImage, variant.variantDetails, variant.variantAltText, variant.variantToolTip )"` ---> calls method in the javascript file.

------
### Computed properties

```javascript
computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    }
  }
```