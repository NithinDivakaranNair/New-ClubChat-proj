
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

})  
 


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server:{
//     port:3000,
//     //Get rid of the CORs error
//     proxy:{
//       "/api":{
//         // target:"http://localhost:5000",
//         target:"https://new-clubchat-proj.onrender.com",
//         changeOrigin:true,
//         secure:false,
//       }, 
//     }, 
//   },
// }) 