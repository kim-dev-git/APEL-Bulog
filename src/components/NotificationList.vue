<template>
  <div id="notification-list">
    <notification-item
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script>

import NotificationItem from './NotificationItem'
export default {
  components: { NotificationItem },
  computed: {
    notifications() {
      return this.$store.state.notifications.notifications
    }
  }
}
</script>

<style>

</style>