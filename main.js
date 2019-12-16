// reading data from the template-form and saving it to the data of the product component
Vue.component('product-review', {
  template: `
    <div>
      <h5>Leave a review:</h5>
      <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors"> {{ error }} </li>
          </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name" placeholder="name">
        </p>
        
        <p>
          <label for="review">Review:</label>      
          <textarea id="review" v-model="review" placeholder="Write your review in here."></textarea>
        </p>
        
        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <!--
        <p>Would you recommend this product?</p>
          <input type="radio" name="recommendation" value="yes" v-model="recommended"> Yes, I recommend it.<br>
          <input type="radio" name="recommendation" value="no" v-model="recommended"> No, I wouldn't<br>
        -->

        <p>
          <input type="submit" value="Submit">  
        </p>
      </form>
    </div>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommended: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      // catch errors and dont submit form if form is empty
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        }
        // let the parent element know that a form was submitted
        this.$emit('review-submitted', productReview)
        // after submit reset all values to null to show a empty form
        this.name = null
        this.review = null
        this.rating = null
      } else {
        // if form is not filled properly (name, rating, review missing), add those errors to the error array
        if (!this.name) this.errors.push("Name required.")
        if (!this.review) this.errors.push("Review required.")
        if (!this.rating) this.errors.push("Rating required.")
      }
    }
  }
})

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
        
        <div v-for="(variant, index) in variants" v-bind:key="variant.variantId" class="color-box"
        v-bind:style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
        </div>

        <br>
        <p>Shipping {{ shipping }}</p>
        
        <button v-on:click="addToCart" :disabled="!inStock" :class="{ 'button:disabled': !inStock }">Add to
        Cart </button>
        
        <!-- v-show="cart >= 1" -->
        <button @click="removeElementsWithIdFromCart">Remove Selected Variant From Cart</button>
        
      </div>

      <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }} </p>
            <p>{{ review.review }} </p>
            <p>Rating: {{ review.rating }} </p>
          </li>
        </ul>
      </div>

      <!-- listen to review-submitted: when that happens add review -->
      <product-review @review-submitted="addReview"></product-review>

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
      reviews: []
    }
  },
  methods: {
    addToCart: function () {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    removeElementsWithIdFromCart() {
      this.$emit('remove-items-from-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct: function (index) {
      this.selectedVariant = index
      console.log(index)
    },
    // update the inStock boolean depending on if there is still an item in the variantQuantity
    //updateInStock() {
    //  if (this.variants[this.selectedVariant].variantQuantity == 0) {
    //    this.inStock = false
    //  } else if (this.variants[this.selectedVariant].variantQuantity > 0) {
    //    this.inStock = true
    //  }
    //}
    addReview(productReview) {
      this.reviews.push(productReview)
    }
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
    removeItemsFromCart(id) {
      for (var i = this.cart.length - 1; i >= 0; i--)
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
    }
  }
})