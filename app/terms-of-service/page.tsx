import type { Metadata } from "next";
import PolicyPage, { type PolicySection } from "@/components/policies/EaziWagePolicies";

export const metadata: Metadata = {
  title: " EaziWage Terms of Service",
  description: "Learn about EaziWage's Terms of Service, which outlines the rules and guidelines for using our services.",
};

const lastRevised = new Date("2026-10-16T00:00:00Z");

const sections: PolicySection[] = [
    {
        id: "introduction",
        title: "1. Introduction",
        paragraphs: [
            "No portion of this service may be reproduced in any form, or by any means, without prior written permission from EaziWage Holdings Limited (“EaziWage”, the “Firm”, “we/us/our”). The term “EaziWage” refers to EaziWage Holdings Limited and its associated entities (the “Group”), either individually and/or collectively as the context requires." 
        ],
    },
    {
        id: "rules-and-regulations",
        title: "2. Rules and Regulations",
        paragraphs: [
            "The following rules and regulations apply to all visitors to or users of this website (“Website”). By accessing this Website, user acknowledges acceptance of these terms and conditions. EaziWage reserves the right to change these rules and regulations from time to time at its sole discretion. In the case of any violation of these rules and regulations, EaziWage reserves the right to seek all remedies available by law for such violations.",
            "These rules and regulations apply to all visits to EaziWage Website, both now and in the future."
        ]
    },
    {
        id: "copyright",
        title: "3. Copyright",
        paragraphs: [
            "EaziWage owns all rights to this Website and all components thereof including without limitation, all text, information, UI & UX, materials, structure, sequence and organisation of the pages and screens.",
            "No part of this Website may be copied, reproduced, republished, uploaded, posted, transmitted, distributed in any form or manner (including electronic, mechanical, photocopy, recording or otherwise) or by any means (including storage in any retrieval system of any nature) without the prior written permission of EaziWage. Modi ication of this Website or any part thereof or use of any materials contained in the Website for any purpose is a violation of copyright law and other proprietary rights. The use of any materials contained in the Website on any other website or networked computer environment is prohibited."
        ]
    },
    {
        id: "trademarks",
        title: "4. Trademarks",
        paragraphs: [
            "The trademarks, logos and service marks (“Marks”) displayed on this Website are the property of EaziWage or other third parties. Users are not permitted to use these Marks without the prior written consent of EaziWage or such third party, which may own the Mark."
        ]
    },
    {
        id: "general-disclaimer",
        title: "5. General Disclaimer",
        paragraphs: [
            "The information provided on this Website is not intended for distribution to, or use by, any person or entity in any jurisdiction or country where such distribution or use would be contrary to the laws or regulations or which would subject EaziWage Holdings Ltd or its associated entities, subsidiaries or af iliates to any registration requirement within such jurisdiction or country.",
            "The information and materials contained in this Website shall not be construed as a solicitation or offer by EaziWage to buy or sell any products, services, other  inancial instruments, nor does it purport to provide any investment or  inancial advice or an invitation to enter into any legally binding contract or arrangement.",
            "Although EaziWage has attempted to provide accurate information on the Website, EaziWage assumes no responsibility for the accuracy or completeness of the information. EaziWage may change the materials, products or services mentioned at any time without notice. The materials, products and services at this Website may be out of date, and EaziWage makes no commitment to update the materials and services at this Website.",
            "Mention of non-EaziWage products or services is for information purposes only and constitutes neither an endorsement nor a recommendation.",
            "ALL INFORMATION PROVIDED ON THIS WEBSITE IS PROVIDED “AS IS” WITH ALL FAULTS WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED. EAZIWAGE AND ITS SUPPLIERS DISCLAIM ALL WARRANTIES, EXPRESSED OR IMPLIED INCLUDING, WITHOUT LIMITATION, THOSE OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OR ARISING FROM A COURSE OF DEALING, USAGE, OR TRADE PRACTICE.",
            "EAZIWAGE SHALL NOT BE LIABLE FOR ANY INDIRECT, SPECIAL, CONSEQUENTIAL, OR INCIDENTAL DAMAGES INCLUDING, WITHOUT LIMITATION, LOST PROFITS OR REVENUES, COSTS OF REPLACEMENT GOODS, LOSS OR DAMAGE TO DATA ARISING OUT OF THE USE OR INABILITY TO USE THIS WEBSITE OR ANY EAZIWAGE PRODUCT, DAMAGES RESULTING FROM USE OF OR RELIANCE ON THE INFORMATION PRESENT, EVEN IF EAZIWAGE OR ITS SUPPLIERS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
            "EAZIWAGE DOES NOT HOLD ITSELF NOR ANY OF ITS DIRECTORS, OFFICERS, EMPLOYEES OR AGENTS OUT AS ADVISING YOU WITH RESPECT TO ANY INFORMATION ON THIS WEBSITE. YOU SHOULD SEEK PROFESSIONAL ADVICE AT ALL TIMES AND OBTAIN INDEPENDENT VERIFICATION OF THE INFORMATION AND MATERIALS CONTAINED HEREIN BEFORE MAKING ANY DECISION BASED ON ANY SUCH INFORMATION OR MATERIALS."
        ]
    },
    {
        id: "indenmity",
        title: "6. Indemnity",
        paragraphs: [
            "You hereby irrevocably agree to indemnify and keep indemnitied EaziWage from all liabilities, claims, losses and expenses, including any legal fees that may be incurred by EaziWage in connection with or arising from (1) your use or misuse of this Website and the services provided herein, or (2) your breach of these terms and conditions howsoever occasioned, or (3) any intellectual property right or proprietary right infringement claim made by a third party against EaziWage in connection with your use of this Website."
        ]
    },
    {
        id: "disclosure",
        title: "7. Disclosure; Forward-looking Statements",
        paragraphs: [
            "Some of the information on this Website may contain projections or other forwardlooking statements regarding future events or the future  inancial performance of EaziWage. We wish to caution you that these statements are only predictions and those actual events or results may differ materially."
        ]
    },
    { 
        id: "use-of-links",
        title: "8. Use of Links",
        paragraphs: [
            "This Website may contain links to third party sites. Access to any other Internet site linked to this Website is at the user’s own risk and EaziWage is not responsible for the accuracy or reliability of any information, data, opinions, advice or statements made on this Website. EaziWage provides these links merely as a convenience and the inclusion of such links does not imply an endorsement.",
            "EaziWage shall not be responsible and makes no warranties in respect of the content of such linked websites, any third parties named therein or their products or services.",
            "EaziWage shall not be responsible or liable for damages or losses arising from your access to and/or use of such linked websites.",
            "Links in any form from a third-party website to this Website shall only be created with the prior written approval of EazoWage. Any use or display of any logos, trade names, trademarks, web content or material of EaziWage in any form is not permitted except with the prior written approval of EaziWage.",
            "For the avoidance of doubt, EaziWage is not responsible for the setup of any hyperlink from a third-party website to the Website, and the appearance of a link at an external website to this Website does not in any way mean that the said link was necessarily authorised by EaziWage nor does it constitute any form of cooperation with or endorsement by EaziWage of such third-party websites or contents therein."
        ]
    },
    {
        id: "governing-law",
        title: "9. Governing Law",
        paragraphs: [
            "These terms and conditions shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any dispute arising out of or in connection with these terms and conditions shall be subject to the exclusive jurisdiction of the courts of the Republic of Kenya."
        ]
    }
]

export default function TermsOfServicePage() {
  return (
    <PolicyPage
        title="EaziWage Terms of Service"
        description="The Terms & Conditions (“T&Cs”) applies to all employees, employers, contractors, agents, investors, banks and any other individuals or entities within the EaziWage Group, if and where relevant."
        updated={lastRevised.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })}
        sections={sections}
    />
  );
}