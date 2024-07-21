import axios from "../../services/api"
import { Button } from "react-bootstrap"
import {toast} from 'react-toastify'
// import { useNavigate } from "react-router-dom"

const PayButton = ({serviceData}) => {

    // const navigate = useNavigate()

    const service = {
      name: serviceData.name,
      quantity: serviceData.quantity || 1,
      price: serviceData.price
    }

    const handleBookService = async() => {
      
      try {
        const {data} = await axios.post(`/stripe/create-checkout-session`,service)
        console.log(data)
        if(data){
            window.location.href = data.url
            // navigate('/service')
            toast.success('Check out successfully!')
        }
      } catch (error) {
        toast.error('Fail to check out!')
        return
      }
      
      
    }

    return (
        <Button variant="outline-primary" onClick={()=>handleBookService()}>Book</Button>
      
    )
  }

  export default PayButton