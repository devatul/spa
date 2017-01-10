var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

module.exports = React.createClass({

  render: function () {
    return (
      <div className="principal-section-loggedout">
        <div className="section-title">
          <h2 className="align-center">Terms and conditions</h2>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xs-1 col-md-2"></div>
            <div className="col-xs-10 col-md-8">
              <p>
                Welcome to the Nubity application, cloud manager and monitor service (the "Service"), a service of Nubity, Inc. 
                ("Nubity", "we", or "us"). Please read these Terms of Service carefully, as they contain the legal terms and conditions 
                that govern your use and access of the Service. Nubity reserves the right to update and change the Terms of Service 
                from time to time by posting an updated version of such Terms of Service at 
                <a href="https://nubity.com/terms" target="_blank">https://nubity.com/terms</a> no later than thirty (30) days prior to 
                the posted effective date of such update. If you continue to use or access the Service after the posted effective date, 
                you hereby agree to the updated Terms of Service. Unless Nubity otherwise indicates, your use of any new features, 
                changes, and enhancements to the current Service, including the release of new features and resources, shall be subject 
                to the Terms of Service.
              </p>
              <p>
                BY SIGNING UP FOR AN ACCOUNT OR BY USING THE SERVICE, YOU HEREBY ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTAND, AND 
                AGREE TO BE BOUND BY THESE TERMS OF SERVICE. THE TERM "YOU" REFERS TO THE INDIVIDUAL OR CORPORATE END USER THAT IS 
                SPECIFIED IN THE REGISTRATION INFORMATION ASSOCIATED WITH SUCH END USER’S ACCOUNT FOR THE SERVICE.
              </p>
              <h3 className="align-center">Account Terms</h3>
              <ol>
                <li>
                  You must provide your legal full name, a valid email address, and any other information requested during the 
                  account signup process in order to obtain an account. You must ensure that all account information remains complete 
                  and accurate.
                </li>
                <li>You must be a human. Accounts registered by "bots" or other automated methods are not permitted.</li>
                <li>
                  You are responsible for maintaining the security of your account and password, and are responsible for all 
                  activities conducted using your account and password. Nubity cannot and will not be liable for any loss or damage 
                  from your failure to comply with this security obligation.
                </li>
                <li>
                  You may not use the Service for any illegal or unauthorized purpose. Without limiting the foregoing, you may use 
                  the Service only in accordance with the use parameters of your account’s plan level ("Plan Level"), including host 
                  and user limitations, and you agree not to attempt to circumvent such limitations.
                </li>
              </ol>
              <h3 className="align-center">Payment and Pricing Terms</h3>
              <p>
                Payment and pricing terms for the Service are set forth on Nubity's pricing information page available at 
                <a href="http://www.nubity.com/pricing" target="_blank">http://www.nubity.com/pricing</a>, which is incorporated by 
                reference into these Terms of Service.
              </p>
              <h3 className="align-center">Cancellation and Termination</h3>
              <ol>
                <li>
                  You will continue to be billed for the Service until Nubity terminates your account in accordance with these 
                  Terms of Service or you properly cancel your account. You are solely responsible for properly canceling your account. 
                  You can cancel your account by browsing to your account settings, selecting the subscription tab, and clicking 
                  "Cancel my account".
                </li>
                <li>
                  If you cancel the Service before the end of your current paid up month, your cancellation will take effect upon 
                  completion of the billing cycle that has already been paid.
                </li>
                <li>
                  Nubity, in its sole discretion, has the right to suspend or terminate your account and refuse any and all current 
                  or future use of the Service, or any other Nubity service, for any reason at any time. Such termination of the 
                  Service will result in the suspension or deletion of your Account or your access to your Account. Nubity reserves the 
                  right to refuse service to anyone for any reason at any time.
                </li>
              </ol>
              <h3 className="align-center">Modifications to the Service and Prices</h3>
              <ol>
                <li>
                  Nubity reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, 
                  the Service (or any part thereof) with or without notice.
                </li>
                <li>
                  Prices of all Services, including but not limited to monthly subscription plan fees to the Service, are subject 
                  to change upon 30 days notice from Nubity. Such notice may be provided at any time by posting the changes to the 
                  Nubity Site (my.nubity.com or www.nubity.com) or the Service itself. If you do not agree to such pricing change, you 
                  may cancel your account during such 30-day period. By continuing to use the Service after the effective date of such 
                  pricing change, you hereby agree to such pricing change.
                </li>
                <li>
                  Nubity shall not be liable to you or to any third party for any modification, price change, suspension or 
                  discontinuance of the Service.
                </li>
              </ol>
              <h3 className="align-center">Software Licenses, Copyright and Content Ownership</h3>
              <p>
                All software (including the Nubity agent) that is furnished to you in connection with the Service is provided 
                subject to the terms of a separate end-user license agreement that accompanies such software. You agree to abide by the 
                terms of such end-user license agreement in your use of such software.
              </p>
              <p>
                The Service (including all of its software and technology components), together with all intellectual property 
                rights therein, are the exclusive property of Nubity and its suppliers. The look and feel of the Service is copyright ©
                2008 - 14 Nubity, Inc. All rights reserved. You may not duplicate, copy, or reuse any portion of the HTML/CSS or visual 
                design elements of the Service without express written permission from Nubity. Other trademarks, service marks, and 
                trade names that may appear on the Site are the property of their respective owners.
              </p>
              <h3 className="align-center">Service Level Commitment</h3>
              <p>
                Nubity is committed to providing our customers with a great experience with our products. Nubity is provided using 
                the software-as-a-service model. In this model, the software you use to manage your application is comprised of two 
                components: The Nubity Agent, which is a small software module that is deployed inside your application; and the 
                Service which is a set of software programs that collect, store, correlate and present the metric data sent from the 
                Agent in your application to our service. The service level within Nubity's control is the Availability of the Service. 
                The Service shall be considered Available so long as customers are able to log in to the Nubity user interface and see 
                application performance data. We endeavor to make the Service Available at all times with the exception of very short 
                maintenance windows that occur periodically throughout the month. Nubity will use commercially reasonable efforts to 
                maintain Service Availability of at least 99.8% during any monthly billing cycle. Excluding planned maintenance 
                periods, in the event the Service Availability drops below 99.8% for two consecutive monthly billing cycles or if the 
                Service Availability drops below 99.0% in any single monthly billing cycle, you may terminate the Service with no 
                penalty. Such termination will be effective as of the end of the then-current billing period and no additional fees 
                shall be charged. Customers may request the service level attainment for the previous month by filing a support ticket 
                on our Support Site.
              </p>
              <h3 className="align-center">General Conditions</h3>
              <ol>
                <li>
                  Your use of the Service is at your sole risk, and Nubity makes no representations that the Service will 
                  accurately diagnose or correct every performance problem in your application.
                </li>
                <li>
                  Technical support is only provided to users that have paid for a Plan Level, and no technical support is 
                  available for any free Plan Levels. Technical Support shall be provided in accordance with the terms and conditions 
                  set forth in the Nubity Support FAQ, available at <a href="https://nubity.com/en/faq" target="_blank">
                  https://nubity.com/en/faq</a>.
                </li>
                <li>
                  You understand that Nubity uses third party vendors and hosting partners to provide the necessary hardware, 
                  software, networking, and related technology required to run the Service. Nubity is not responsible for any failures 
                  attributable to third parties.
                </li>
                <li>
                  You must not modify, adapt or hack the Service or modify another website so as to falsely imply that it is 
                  associated with the Service, Nubity, or any other Nubity service.
                </li>
                <li>
                  You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the 
                  Service, or access to the Service without the express written permission by Nubity.
                </li>
                <li>
                  You understand that the technical processing and transmission of the Service may be transferred unencrypted over 
                  a network, and assume all risks related thereto. Nubity shall not be liable to you for any liabilities arising from 
                  the operation of the Service over the Internet or other network.
                </li>
                <li>
                  You must not transmit any worms or viruses or any code of a destructive nature.
                </li>
                <li>
                  If the amount of data collected in providing your Service significantly exceeds the average amount of data 
                  collected (as determined solely by Nubity) of other Nubity customers at your subscription level, we reserve the right 
                  to immediately disable your account or throttle your Service until you can reduce your bandwidth consumption.
                </li>
              </ol>
              <p>
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, AND Nubity EXPRESSLY DISCLAIMS ANY WARRANTIES AND 
                CONDITIONS OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
                FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, OR NON-INFRINGEMENT. WITHOUT LIMITING THE 
                FOREGOING, NUBITY DOES NOT WARRANT THAT THE SERVICE WILL MEET YOUR SPECIFIC REQUIREMENTS, THAT THE SERVICE WILL BE 
                UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, THAT THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL 
                BE COMPLETE, ACCURATE, OR RELIABLE, THAT THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL 
                PURCHASED OR OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS, OR THAT ANY ERRORS IN THE SERVICE WILL BE 
                CORRECTED.
              </p>
              <h3 className="align-center">Limitation of Liability</h3>
              <p>
                YOU EXPRESSLY UNDERSTAND AND AGREE THAT NUBITY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR 
                OTHER INTANGIBLE LOSSES (EVEN IF Nubity HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), INCLUDING ANY SUCH 
                DAMAGES RESULTING FROM THE USE OR THE INABILITY TO USE THE SERVICE; THE COST OF PROCUREMENT OF SUBSTITUTE GOODS AND 
                SERVICES RESULTING FROM ANY GOODS, DATA, INFORMATION OR SERVICES PURCHASED OR OBTAINED OR MESSAGES RECEIVED OR 
                TRANSACTIONS ENTERED INTO THROUGH OR FROM THE SERVICE; UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR 
                DATA; STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE SERVICE; TERMINATION OF YOUR ACCOUNT; OR ANY OTHER MATTER 
                RELATING TO THE SERVICE.
              </p>
              <p>
                NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, Nubity’S LIABILITY TO YOU FOR ANY DAMAGES ARISING FROM OR 
                RELATING TO THE SERVICE (FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION) WILL AT ALL TIMES BE 
                LIMITED TO THE GREATER OF FIFTY U.S. DOLLARS (U.S. $50) OR THE AMOUNTS YOU PAID TO Nubity IN THE TWELVE (12) MONTHS 
                IMMEDIATELY PRECEDING THE INCIDENT GIVING RISE TO THE CLAIM.
              </p>
              <h3 className="align-center">Miscellaneous</h3>
              <p>
                This Agreement shall be governed by the laws of the State of California without giving effect to any conflicts of 
                laws principles that may require the application of the law of a different jurisdiction. For any dispute or proceeding 
                arising from or relating to this Agreement, you agree to submit to the jurisdiction of, and agree that venue is proper 
                in, the state courts located in San Francisco County, California, and in the federal courts located in the Northern 
                District of California. The failure of Nubity to exercise or enforce any right or provision of the Terms of Service 
                shall not constitute a waiver of such right or provision. The Terms of Service constitutes the entire agreement between 
                you and Nubity and govern your use of the Service, superceding any prior agreements between you and Nubity (including, 
                but not limited to, any prior versions of the Terms of Service).
              </p>
              <p>
                In addition, our privacy policy: <a href="https://nubity.com/privacy" target="_blank">https://nubity.com/privacy</a> 
                is incorporated into, and considered a part of the Nubity Terms of Service.
              </p>
              <p>
                These Terms of Service were last updated on March 13, 2014. You can review the most current version of the Terms of 
                Service at any time at: <a href="https://nubity.com/terms" target="_blank">https://nubity.com/terms</a>. Questions about 
                the Terms of Service should be sent to contact@nubity.com
              </p>
            </div>
            <div className="col-xs-1 col-md-2"></div>
          </div>
        </div>
        <div className="gra"></div>
      </div>
    );
  },
});
