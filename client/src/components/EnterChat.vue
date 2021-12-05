<template lang="en">
    <div class="join-container">
			<header class="join-header">
				<h1><i class="fas fa-smile"></i> ChatCord</h1>
			</header>
			<main class="join-main">
				<form action="JoinRoom">
					<div class="form-control">
						<label for="username">Username</label>
						<input
							type="text"
							name="username"
                            v-model="user"
							id="username"
							placeholder="Enter username..."
							required
						/>
					</div>
					<div class="form-control">
						<label for="room">Room</label>
						<select name="room" id="room" v-model="selected">
							<option value="JavaScript">JavaScript</option>
							<option value="Python">Python</option>
							<option value="PHP">PHP</option>
							<option value="C#">C#</option>
							<option value="Ruby">Ruby</option>
							<option value="Java">Java</option>
						</select>
					</div>
					<button type="submit" class="btn">Join Chat</button>
				</form>
			</main>
		</div>
</template>
<script>
export default {
    name: 'EnterChat'
}
</script>
<style lang="">
    
</style>