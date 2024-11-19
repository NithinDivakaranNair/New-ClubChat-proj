
  <h1> ClubChat (social media) 🌐</h1>

  <p>Clubchat is a feature-rich social media application designed to bring people closer through seamless user interactions, real-time messaging, and engaging content sharing. Experience a modern UI, real-time notifications, and a secure environment for social connections.</p>

  <hr>

  <h2>✨ Features at a Glance</h2>
  <ul>
    <li><strong>User Authentication:</strong> Secure login and signup powered by JWT.</li>
    <li><strong>Real-Time Chat:</strong> Stay connected with friends through instant messaging with sound notifications.</li>
    <li><strong>Post Creation & Sharing:</strong> Share your thoughts and media with a global audience.</li>
    <li><strong>User Suggestions:</strong> Find and connect with people you may know.</li>
    <li><strong>Media Uploads:</strong> Upload images effortlessly with Cloudinary integration.</li>
    <li><strong>Dark/Light Mode:</strong> Customize your experience with Chakra UI's theme switcher.</li>
    <li><strong>Account Blocking:</strong> Control your privacy and safety.</li>
    <li><strong>Dockerized Deployment:</strong> Scalable and efficient deployment using Docker.</li>
  </ul>

  <hr>

  <h2>🛠️ Tech Stack</h2>
  <ul>
    <li><strong>Frontend:</strong> React.js, Chakra UI, Recoil for state management</li>
    <li><strong>Backend:</strong> Node.js, Express.js</li>
    <li><strong>Database:</strong> MongoDB Atlas</li>
    <li><strong>Real-Time:</strong> Socket.io for live messaging</li>
    <li><strong>Deployment:</strong> AWS EC2 with Docker</li>
    <li><strong>Media Storage:</strong> Cloudinary</li>
  </ul>

  <hr>

  <h2><a href="https://new-clubchat-proj.onrender.com/auth">Live Demo</a></h2>
  <p>👉 Click <a href="https://new-clubchat-proj.onrender.com/auth">here</a> to experience <strong>ClubChat</strong> live in action!</p>

  <hr>

  <h2>📖 Installation Guide</h2>

  <p>Follow these steps to set up SocialThreads locally:</p>

  <h3>1️⃣ Clone the Repository</h3>
  <pre><code>git clone https://github.com/NithinDivakaranNair/New-ClubChat-proj
cd clubchat</code></pre>

  <h3>2️⃣ Install Dependencies</h3>
  <p>Navigate to both the <strong>backend</strong> and <strong>frontend</strong> directories and install the necessary dependencies.</p>

  <h4>For Backend:</h4>
  <pre><code>cd backend
npm install</code></pre>

  <h4>For Frontend:</h4>
  <pre><code>cd frontend
npm install</code></pre>

  <h3>3️⃣ Set Up Environment Variables</h3>
  <p>You will need to create <strong>.env</strong> files in both the <strong>server</strong> and <strong>client</strong> directories.</p>

  <h4>Server <strong>.env</strong>:</h4>
  <p>Create a <strong>.env</strong> file in the <strong>server</strong> directory and add the following variables:</p>
  <pre><code>PORT=5000
MONGO_URI=your_mongo_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret</code></pre>
  <p>Replace <code>your_mongo_atlas_uri</code>, <code>your_jwt_secret</code>, <code>your_cloudinary_name</code>, <code>your_cloudinary_api_key</code>, and <code>your_cloudinary_api_secret</code> with your actual values from MongoDB Atlas and Cloudinary.</p>

  <h4>Client <strong>.env</strong>:</h4>
  <p>Create a <strong>.env</strong> file in the <strong>client</strong> directory and add the following content:</p>
  <pre><code>REACT_APP_API_BASE_URL=http://localhost:5000</code></pre>
  <p>This ensures the React frontend connects to the local backend.</p>

  <h3>4️⃣ Running the Application</h3>
  <p>Once all dependencies are installed and the environment variables are set, you can run the application.</p>

  <h4>Start the Backend Server:</h4>
  <pre><code>cd backend
npm run dev</code></pre>
  <p>This will start the backend server on <code>http://localhost:5000</code>.</p>

  <h4>Start the Frontend:</h4>
  <pre><code>cd frontend
npm start</code></pre>
  <p>This will start the React development server on <code>http://localhost:3000</code>.</p>
  <p>Once both servers are running, you should be able to access your local instance of <strong>SocialThreads</strong> at <a href="http://localhost:3000">http://localhost:3000</a>.</p>

  <hr>

  <h2>🌟 Contributing</h2>
  <p>We welcome contributions to make SocialThreads even better! Fork the repository, make your changes, and submit a pull request.</p>

  <hr>

  <h2>💌 Feedback</h2>
  <p>Have questions, suggestions, or just want to say hi? Drop me a line at <a href="mailto:nithindivakarannair92@gmail.com">nithindivakarannair92@gmail.com</a> or connect on <a href="https://www.linkedin.com/in/nithin-d-nair-81434430a/">LinkedIn</a>.</p>

  <hr>

  <h3>🤝 Made with ❤️ by <a href="https://github.com/NithinDivakaranNair">Nithin D Nair</a></h3>

