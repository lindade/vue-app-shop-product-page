Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      <div class="product-image">
        <img v-bind:src="image" v-bind:alt="altText" v-bind:title="toolTip">
      </div>
      <div class="product-info">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        
        <!-- vue component -->
        <product-details :details="details"></product-details>
        
        <span v-show="onSale">On Sale!</span>
        
        <p v-if="inStock > 10" :class="[inStock ? 'in-stock-color' : '']">In Stock</p>
        <p v-else-if="inStock <= 10 && inStock > 0" class="almost-out-of-stock-color">
        Almost sold out. Only {{ inStock }} remaining.
        </p>
        <p v-else :class="[inStock ? '' : 'out-of-stock-color']">Out of Stock</p>
        
        <p>Shipping {{ shipping }}</p>
        
        <div v-for="(variant, index) in variants" v-bind:key="variant.variantId" class="color-box"
        v-bind:style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
        </div>
        
        <button v-on:click="addToCart" :disabled="!inStock" :class="{ 'button:disabled': !inStock }">Add to
        Cart</button>
        
        <!-- v-show="cart >= 1" -->
        <button @click="emptyCart">Empty Cart</button>
        

      </div>
    </div>
  `,
  data() {
    return {
      brand: 'Lindas',
      product: 'Flower Bourquet',
      selectedVariant: 0,
      altText: "Bouquet of pink and white flowers",
      toolTip: "Bouquet of pink and white flowers",
      description: 'Bouquet of flowers perfect for speacial occasions or as an everyday gift.',
      details: ["1 white Lily", "5 white Carnations", "2 pink Gerbera Daisys", "6 pink Carnations", "Complementary greens"],
      variants: [{
        variantId: 01,
        variantColor: 'MediumVioletRed',
        variantImage: './img/blumen-pink.jpg',
        variantAltText: "Bouquet of pink and white flowers",
        variantToolTip: "Bouquet of pink and white flowers",
        variantDetails: ["1 white Lily", "5 white Carnations", "2 pink Gerbera Daisys", "6 pink Carnations", "Complementary greens"],
        variantOnSale: false,
        variantInStock: true,
        variantQuantity: 3
      }, {
        variantId: 02,
        variantColor: 'MediumPurple',
        variantImage: './img/blumen-lila.jpg',
        variantAltText: "Bouquet of purple flowers",
        variantToolTip: "Bouquet of purple flowers",
        variantDetails: ["6 Agapanthus", "6 Delphimium", "Purple Viola", "Ivy leafs", "Complementary greens"],
        variantOnSale: true,
        variantInStock: true,
        variantQuantity: 20
      }],
      onSale: false,
    }
  },
  methods: {
    addToCart: function () {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    emptyCart() {
      //if (this.cart >= 1) {
      this.$emit('empty-cart', this.variants[this.selectedVariant].variantId)
      //}
    },
    updateProduct: function (index) {
      this.selectedVariant = index
      console.log(index)
    },
    // update the inStock boolean depending on if there is still an item in the inventory
    //updateInStock() {
    //  if (this.inventory == 0) {
    //    this.inStock = false
    //  } else if (this.inventory > 0) {
    //    this.inStock = true
    //  }
    //}
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    altText() {
      return this.variants[this.selectedVariant].variantAltText
    },
    toolTip() {
      return this.variants[this.selectedVariant].variantToolTip
    },
    details() {
      return this.variants[this.selectedVariant].variantDetails
    },
    onSale() {
      return this.variants[this.selectedVariant].variantOnSale
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return "Free"
      }
      return 2.99
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: [],
    url: "https://lindade.github.io/"
  },
  methods: {
    updateCart(id) {
      //this.cart += 1
      this.cart.push(id)
    },
    emptyItemsFromCart(id) {
      for (var i = this.cart.length - 1; i >= 0; i--)
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
    }
  }
})