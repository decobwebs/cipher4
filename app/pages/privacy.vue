<script setup lang="ts">
import { company, headquarters, formatAddress } from '~/data/company'

useSeoMeta({
  title: 'Privacy Policy | Cipher4 AI & Robotics',
  description:
    'How Cipher4 AI & Robotics Ltd collects, uses and protects personal data, in line with the Nigeria Data Protection Act 2023.',
})

const updated = 'August 2026'
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="Legal"
      title="Privacy Policy"
      :lead="`How we handle personal data. Last updated ${updated}.`"
    />

    <section class="section">
      <div class="container">
        <div v-reveal class="prose">
          <div class="notice">
            <Icon name="lucide:info" size="20" />
            <p>
              This policy is written to be understood. It is not legal advice,
              and before launch it should be reviewed by a Nigerian legal
              practitioner familiar with the Nigeria Data Protection Act 2023.
            </p>
          </div>

          <h2>Who we are</h2>
          <p>
            {{ company.legalName }} is a company registered in Nigeria, with
            its head office at {{ formatAddress(headquarters) }}. We are the
            data controller for the personal data described in this policy.
          </p>
          <p>
            For any question about this policy or your data, contact
            <a :href="`mailto:${company.email}`">{{ company.email }}</a>.
          </p>

          <h2>What we collect</h2>
          <p>We collect only what we need to respond to you and to run our business.</p>
          <ul>
            <li>
              <strong>Information you send us.</strong> When you use a form on
              this site, we receive your name, work email, company, phone
              number if you provide one, and the content of your message.
            </li>
            <li>
              <strong>Information from correspondence.</strong> Emails, call
              notes and meeting records created while we discuss or deliver
              work.
            </li>
            <li>
              <strong>Basic technical information.</strong> Standard web server
              information such as the pages requested and approximate location.
              This site does not use advertising or behavioural tracking
              cookies.
            </li>
          </ul>

          <h2>Why we use it</h2>
          <ul>
            <li>To reply to your enquiry and to prepare a proposal or quotation.</li>
            <li>To deliver and support work you have engaged us for.</li>
            <li>To meet legal, tax and regulatory obligations in Nigeria.</li>
          </ul>
          <p>
            We do not sell personal data, and we do not share it with third
            parties for their own marketing.
          </p>

          <h2>The lawful basis</h2>
          <p>
            We process your data on the basis of your consent when you contact
            us, on the basis of contract where we are delivering work to you,
            and on the basis of legal obligation where Nigerian law requires us
            to retain records.
          </p>

          <h2>Who processes it on our behalf</h2>
          <p>
            Form submissions from this website are delivered to our inbox
            through a third-party form service. Our email and business systems
            are provided by established service providers. These providers act
            on our instructions and are not permitted to use your data for
            their own purposes. Some of them process data outside Nigeria.
          </p>

          <h2>How long we keep it</h2>
          <ul>
            <li>
              <strong>Enquiries that do not lead to work:</strong> up to
              24 months, then deleted.
            </li>
            <li>
              <strong>Client records:</strong> for the duration of the
              engagement and for as long afterwards as Nigerian tax and
              company law requires.
            </li>
            <li>
              <strong>Job applications:</strong> up to 12 months unless you ask
              us to keep them longer.
            </li>
          </ul>

          <h2>Your rights</h2>
          <p>
            Under the Nigeria Data Protection Act 2023 you may ask us to give
            you a copy of the personal data we hold about you, correct it if it
            is wrong, delete it, restrict how we use it, or object to our use
            of it. You may also withdraw consent at any time.
          </p>
          <p>
            Write to <a :href="`mailto:${company.email}`">{{ company.email }}</a>
            and we will respond within one month. If you are not satisfied with
            our response, you may complain to the Nigeria Data Protection
            Commission.
          </p>

          <h2>Client operational data</h2>
          <p>
            This policy covers personal data. Operational data held in systems
            we build for clients (asset positions, job records, procurement
            documents) belongs to the client, is governed by the contract for
            that engagement, and is not used by Cipher4 for any other purpose.
          </p>

          <h2>Security</h2>
          <p>
            We apply access controls, encryption in transit, and least-privilege
            access to systems holding personal data. Access is individually
            attributed; we do not use shared accounts.
          </p>

          <h2>Changes</h2>
          <p>
            If we change this policy we will update the date at the top of this
            page. Material changes affecting existing clients will be
            communicated directly.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
