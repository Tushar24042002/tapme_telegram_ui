import { Blocks } from 'react-loader-spinner'

const Loader = () => {
    const loaderCss={
        background : "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "height": "100vh",
        "width": "100%",
      }
  return (
    <div style={loaderCss}>
         <Blocks
    height="80"
    width="80"
    color="#4fa94d"
    ariaLabel="blocks-loading"
    wrapperStyle={{}}
    wrapperClass="blocks-wrapper"
    visible={true}
    />
    </div>
   
  )
}

export default Loader