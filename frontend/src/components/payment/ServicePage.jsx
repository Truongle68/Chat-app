import PayButton from "./PayButton"
import kimCuongGoc from './img/kim-cuong-goc.png'

const ServicePage = () => {

  const serviceData = {
    name: "Diamond Valuation",
    description: "Valuated your diamond follow the 4C's Diamond Scale",
    price: 600
  }

  return(
    <div className="container">
      <h2>Service</h2>
      <div className="service-container">
        <img src={kimCuongGoc} alt="service-img" width={100} />
        <div className="service-content">
          <label htmlFor="">Service Name: {serviceData.name}</label>
          <label htmlFor="">Description: {serviceData.description}</label>
          <label htmlFor="">Price: {serviceData.price}$</label>
        </div>
        <PayButton serviceData={serviceData}/>
      </div>
    </div>
  )
}
export default ServicePage