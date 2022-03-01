
import '../../scss/main.scss';


function Privacy() {

  return (
    <section className='standard-page' id='privacy'>
      <h1>Privacy Policy for Umeko</h1>



      <p>This privacy policy contains all forms of data that we collect and record, as well as how we use said data. This privacy policy applies to both our website and our bot and may and is subject to change in the future as the bot grows. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>

      <h2>Consent</h2>
      <p>By using our website and/or bot, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>


      <h2>Information We collect</h2>

      <p>The following information is collected by us either through the bot or our website:</p>

      <li>Server id's</li>
      <li>Rank card data i.e. card color, card background image, card opacity</li>
      <li>Channel Id's </li>
      <li>Role Id's</li>

      <h2>How We Use This Information</h2>

      <p>The items listed above are used for basic/required functionality and running of the bot in servers. </p>

      <li>Server id's are used to uniquely identify servers.</li>
      <li>Rank card data is used to allow a user to customize their rank card and have said card be accessible from all servers with the bot on it and leveling functionality enabled.</li>
      <li>Channel Id's are used to uniquely identify channels for functionality such as welcome messages and leveling up messages.</li>
      <li>Role Id's are used to uniquely identify roles for functionality such as Showing the currently streaming users for the twitch functionality.</li>

      <h2>Log Files</h2>

      <p>Umeko follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and are a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any personally identifiable information. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
      </p>

      <h2>Third-Party Services</h2>
      <p>Umeko does not share your data with any third-party services.</p>

      <h2>Children's Information</h2>
      <p>Another part of our priority is adding protection for children while using the internet.Umeko does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
      </p>


    </section>
  );

}

export default Privacy;