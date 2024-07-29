<script lang='ts'>
    const urlParams = new URLSearchParams(window.location.search);
    const videoLink = urlParams.get('link') as string;
    console.log(videoLink)

</script>

<video 
    class="w-full max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"  
    width="320" height="240" 
    autoplay
    controls
>
    <source src={videoLink}  type="video/mp4">
    <track kind="captions">
    Your browser does not support the video tag.
</video>