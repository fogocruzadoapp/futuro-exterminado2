<template>
	<div class="share">
		
	  <span>Compartilhe</span>

	  <a onclick="window.open('https://twitter.com/intent/tweet?url='+encodeURIComponent(window.location.href),'_blank'">
		<SvgoTwitter/>
	  </a>
	  <a onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.href),'_blank')">
		<SvgoFacebook />
	  </a>
	  <a onclick="window.open('https://www.linkedin.com/shareArticle?url='+encodeURIComponent(window.location.href),'_blank')">
		<SvgoLinkedin />
	  </a>
	  <a onclick="window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(window.location.href),'_blank')">
		<SvgoWhatsapp/>
	  </a>

	</div>
</template>