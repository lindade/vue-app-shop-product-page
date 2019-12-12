var app = new Vue({
  el: '#app',
  data: {
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
      variantInStock: false,
      variantQuantity: 0
    }],
    onSale: false,
    inventory: 5,
    url: "https://lindade.github.io/",
    cart: 0,
  },
  methods: {
    addToCart: function () {
      this.cart += 1
    },
    removeFromCart() {
      if (this.cart >= 1) {
        this.cart -= 1
      }
    },
    updateProduct: function (index) {
      this.selectedVariant = index
      console.log(index)
    },
    // update the inStock boolean depending on if there is still an item in the inventory
    updateInStock() {
      if (this.inventory == 0) {
        this.inStock = false
      } else if (this.inventory > 0) {
        this.inStock = true
      }
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
    }
  }
});