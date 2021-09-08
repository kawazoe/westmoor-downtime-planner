<template>
  <main>
    <div class="container px-8 mb-24 max-w-prose text-justify">
      <h2>Terms of Service</h2>

      <h3>MIT License</h3>
      <p>Copyright (c) 2020 Etienne Maheu</p>
      <p>
        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the allRights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
      </p>
      <p>
        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.
      </p>
      <p>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
      </p>

      <h3>Personal Information Handling</h3>
      <p>
        This application makes extensive use of Microsoft Azure products as well as
        the Auth0 identity provider. This ensures that private information is stored
        according to industry standard practices. More information is available on
        each specific service provider's website. The developers of this application
        will do their BEST EFFORT not to compromise your data but, in accordance with
        the "AS IS" clause, offers NO GUARANTY as to the security of the information
        that they control or that is given freely to any third-party service provider
        used by the application.
      </p>
      <p>
        In the event of a breach, including known breaches from third parties, the
        developers will attempt to notify you with their BEST EFFORT and will guide
        you toward steps you can take to protect your information.
      </p>

      <h4>GDPR & DMCA Requests</h4>
      <p>
        The vast majority of the content on this site is user generated. While we
        are only a small scale project, we will do our best to ensure that none of
        the content on this site violates any copyrights and respects GDPR's
        guidelines.
      </p>
      <p>
        If you have any concerns with something on this site, please contact the
        maintainer of the application via a GitHub issue.
      </p>
    </div>
  </main>
</template>

<script>
export default { name: 'TheTermsOfService' };
</script>

<style scoped>
p { @apply mb-4; }
h2 { @apply text-2xl mt-12 mb-8; }
h3 { @apply text-xl mt-8 mb-4; }
h4 { @apply text-lg mt-4 mb-2; }
</style>
