import "./App.css";
import React from "react";
import SigninScreen from "./screens/Auth/SigninScreen";
import SignupScreen from "./screens/Auth/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import AddProductsScreen from "./screens/Product/AddProductsScreen";
import EditProfileScreen from "./screens/Profile/EditProfileScreen";
import Error404Screen from "./screens/Error/Error404Screen";
import ProductDetailScreen from "./screens/Product/ProductDetailScreen";
import ProductPreviewScreen from "./screens/Product/ProductPreviewScreen";
import EditProductScreen from "./screens/Product/EditProductScreen";
import shopScreen from "./screens/shop/ShopScreen";

class App extends React.Component {

  render() {
    return (
      <div className="w-screen h-auto absolute ">
        <Router>
          <Switch>
            <Route exact path={["/", "/home"]} component={HomeScreen}/>
            <Route exact path="/profile" component={ProfileScreen}/>
            <Route exact path="/addproduct" component={AddProductsScreen}/>
            <Route exact path="/editproduct" component={EditProductScreen}/>
            <Route exact path="/editprofile" component={EditProfileScreen}>
              <Redirect to="/editprofile/personalInfo"/>
            </Route>
            <Route exact path={["/editprofile/personalInfo", "/editprofile/address", "/editprofile/payment"]} component={EditProfileScreen}/>
            <Route exact path={["/profile/upgradeToSeller"]} component={ProfileScreen}/>
            <Route path="/productdetail" component={ProductDetailScreen}/>
            <Route path="/productpreview" component={ProductPreviewScreen}/>
            <Route path="/signin" component={SigninScreen}/>
            <Route path="/signup" component={SignupScreen}/>
            <Route path="/shop" component={shopScreen}/>
            <Route component={Error404Screen}/>
          </Switch>
        </Router>
      </div>
    );
  }
}
export default App;
