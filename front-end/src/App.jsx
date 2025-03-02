import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"
import HowItWorks from "./pages/How_It_Works/HowItWorks"


import Home from "./pages/Home/Home"
import Categories from "./pages/Categories/Categories"

import { Route, Routes} from "react-router-dom"

export default function App(){
  return(
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
      <Footer />
    </>
  )
}