<script>
  import { Heading, Span } from 'flowbite-svelte';
  import Apple from '$lib/images/apple.svg';
  import Google from '$lib/images/google.svg';
  import { Input, Label, ButtonGroup, Button, Checkbox, A } from 'flowbite-svelte';
  import "@fontsource/roboto";

</script>
  
<div class="h-screen m2 flex items-center justify-center">
  <div class="border-2 p-2 rounded-xl bg-white bg-opacity-80">

    <h1 class="text-3xl font-bold text-center roboto">
      Get Started Now
    </h1>
    
    <form>
      <Label for="first_name" class="mb-2">
        Name
      </Label>
      <Input type="text" id="name" placeholder="John" size="md" required />
  
      <Label for="email" class="mb-2">Email address</Label>
      <Input type="email" id="email" placeholder="john.doe@company.com" required />
      
      <Label for="password" class="mb-2">Password</Label>
      <Input type="password" id="password" placeholder="•••••••••" required />
      
      <Label for="confirm_password" class="mb-2">Confirm password</Label>
      <Input type="password" id="confirm_password" placeholder="•••••••••" required />

      <Checkbox class="p-2" id="terms" name="terms" required>
        I agree to the <A href="#" class="text-blue-600">&nbsp; terms and conditions</A>
      </Checkbox>

      <Button type="submit" class="p-2 w-full bg-green-300 text-black hover:bg-green-500 hover:text-black">
        Sign Up
      </Button> 
  
    </form>

    <div class="p-2">
      <div class="flex items-center">
        <div class="flex-1 border-t border-black"></div>
        <span class="px-2 text-black">Or</span>
        <div class="flex-1 border-t border-black"></div>
      </div>

      <div class="flex items-center">
        <Button class="m-2 bg-white text-black border-gray-700 border-[1px] hover:bg-gray-100">
          <img alt="Apple Logo" class="w-5 h-5 me-2" src={Apple} />
          Sign Up with Apple
        </Button>
        <Button class="m-2 bg-white text-black border-gray-700 border-[1px] hover:bg-gray-100">
          <img alt="Google Logo" class="w-5 h-5 me-2" src={Google} />
          Sign Up with Google
        </Button>
      </div>

      <div>
        <p></p>
      </div>

    </div>
  
  </div>
</div>

<style>
  .roboto {
    font-family: 'Roboto', sans-serif;
  }
  .modal {
    background-color: rgba(255, 255, 255, 0.95);
  }

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    .modal {
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      background-color: rgba(255, 255, 255, 0.5);  
    }
    .warning {
      display: none;
    }
  }
</style>