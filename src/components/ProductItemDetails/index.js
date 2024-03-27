// Write your code here
import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const initialQuantity = 1

class ProductItemDetails extends Component {
  state = {
    productDetailsList: {},
    similarProductsList: [],
    apiStatus: apiStatusConstants.initial,
    quantity: initialQuantity,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const productDetailsApiUrl = `https://apis.ccbp.in/products/${id}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(productDetailsApiUrl, option)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const formattedData = this.getFormattedData(fetchedData)
      console.log(formattedData)
      const formattedSimilarProdcutsData = fetchedData.similar_products.map(
        eachItem => this.getFormattedData(eachItem),
      )
      this.setState({
        productDetailsList: formattedData,
        similarProductsList: formattedSimilarProdcutsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProductItemSuccessView = () => {
    const {productDetailsList, quantity} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productDetailsList

    const onClickIncrementQuantity = () => {
      if (quantity >= 1) {
        this.setState(prevState => ({
          quantity: prevState.quantity + 1,
        }))
      }
    }

    const onClickDecrementQuantity = () => {
      if (quantity > 1) {
        this.setState(prevState => ({
          quantity: prevState.quantity - 1,
        }))
      }
    }
    return (
      <div className="product-item-details-container">
        <div className="product-item-detail-img-container">
          <img
            src={imageUrl}
            alt="product"
            className="product-item-detail-img"
          />
        </div>
        <div className="product-item-detail-content">
          <h1 className="product-item-detail-title">{title}</h1>
          <p className="product-item-detail-price">Rs {price}/-</p>
          <div className="product-item-detail-rating-reviews-holder">
            <div className="product-item-detail-rating-holder">
              <p className="product-item-detail-rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="product-item-detail-star-img"
              />
            </div>
            <p className="product-item-detail-total-reviews">
              {totalReviews} Reviews
            </p>
          </div>
          <p className="product-item-detail-description">{description}</p>
          <p className="product-item-detail-availability-header">
            Available:
            <p className="availability-value"> {availability}</p>
          </p>
          <p className="product-item-detail-brand-header">
            Brand:
            <p className="brand-value"> {brand}</p>
          </p>
          <hr className="hr-line" />
          <div className="product-item-detail-quantity-container">
            <button
              className="quantity-btn"
              type="button"
              data-testid="minus"
              aria-label="Decrease quantity"
              onClick={onClickDecrementQuantity}
            >
              <BsDashSquare className="quantity-icon" />
            </button>
            <p className="quantity-value">{quantity}</p>
            <button
              className="quantity-btn"
              type="button"
              data-testid="plus"
              aria-label="Increase quantity"
              onClick={onClickIncrementQuantity}
            >
              <BsPlusSquare className="quantity-icon" />
            </button>
          </div>
          <button type="button" className="add-to-cart-btn">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-view-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {similarProductsList, apiStatus} = this.state
    return (
      <>
        <Header />
        {this.renderProductItemDetails()}
        {apiStatus === apiStatusConstants.success && (
          <div className="similar-products-container">
            <h1 className="similar-products-heading">Similar Products</h1>
            <ul className="similar-products-list">
              {similarProductsList.map(eachItem => (
                <SimilarProductItem
                  similarProductsList={eachItem}
                  key={eachItem.id}
                />
              ))}
            </ul>
          </div>
        )}
      </>
    )
  }
}

export default ProductItemDetails
