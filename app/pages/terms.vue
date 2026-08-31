<script setup lang="ts">
import { company } from '~/data/company'

useSeoMeta({
  title: 'Terms of Use | Cipher4 AI & Robotics',
  description:
    'Terms governing the use of the Cipher4 AI & Robotics Ltd website.',
})

const updated = 'August 2026'
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="Legal"
      title="Terms of Use"
      :lead="`Terms governing this website. Last updated ${updated}.`"
    />

    <section class="section">
      <div class="container">
        <div v-reveal class="prose">
          <div class="notice">
            <Icon name="lucide:info" size="20" />
            <p>
              These terms cover use of this website only. They are not the
              terms of any engagement. Those are set out in the contract for
              that work. Have these reviewed by a Nigerian legal practitioner
              before launch.
            </p>
          </div>

          <h2>About these terms</h2>
          <p>
            This website is operated by {{ company.legalName }}, a company
            registered in Nigeria. By using the site you accept these terms.
          </p>

          <h2>What is on this site</h2>
          <p>
            The content here describes our capabilities in general terms. It is
            not a technical specification, a warranty, or an offer to contract.
            Nothing on this site should be relied on as engineering advice for
            a specific situation. That requires an assessment of your
            operation, which is where every engagement starts.
          </p>
          <p>
            We keep the site accurate and current, but we do not guarantee that
            every statement is complete or free of error, and we may change
            content without notice.
          </p>

          <h2>Ownership</h2>
          <p>
            The Cipher4 name, logo, page designs, text and images on this site
            belong to {{ company.legalName }} or are used with permission. You
            may read, print and share pages for your own business evaluation.
            You may not republish, resell or present our content as your own,
            or use our branding without written permission.
          </p>

          <h2>Third-party names</h2>
          <p>
            Product, vendor and organisation names mentioned on this site belong
            to their respective owners. Mentioning a product does not imply a
            partnership or endorsement unless we say so explicitly.
          </p>

          <h2>Links</h2>
          <p>
            Where we link to other sites, we do not control them and are not
            responsible for their content or their handling of your data.
          </p>

          <h2>Limits</h2>
          <p>
            We provide this website as it is. To the extent Nigerian law
            allows, we are not liable for loss arising from reliance on website
            content, from the site being unavailable, or from any indirect or
            consequential loss. Nothing here limits liability that cannot
            lawfully be limited.
          </p>

          <h2>Contacting us through this site</h2>
          <p>
            Please do not send confidential or commercially sensitive material
            through the website forms. If you need to share something sensitive,
            email <a :href="`mailto:${company.email}`">{{ company.email }}</a>
            and we will agree a secure route first.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the Federal Republic of
            Nigeria, and disputes are subject to the jurisdiction of the
            Nigerian courts.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms:
            <a :href="`mailto:${company.email}`">{{ company.email }}</a>.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
