// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductsList} = props
  const {title, brand, price, rating, imageUrl} = similarProductsList
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-item-image"
      />
      <h1 className="similar-product-item-title">{title}</h1>
      <p className="similar-product-item-brand">{brand}</p>
      <div className="similar-product-item-price-holder">
        <p className="similar-product-item-price">Rs {price}/-</p>
        <div className="similar-product-item-rating-holder">
          <p className="similar-product-item-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-product-item-star-icon"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
