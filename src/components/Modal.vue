<template>
    <div class="modal" role="dialog" v-show="visible" tabindex="-1">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <slot name="header">Title</slot>
            </h5>
            <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                v-on:click="$emit('close')"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'Modal',
      props: {
        visible: Boolean
      }
    };
</script>

<style scoped lang="scss">
.modal {
  display: block;
  z-index: 1100;

  &:before {
    content: "";
    display: block;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // z-index: 10;
  }

  &:target {
    &:before {
      display: block;
    }
  }
}
.modal-dialog {
  overflow-y: initial !important;
}
.modal-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
@media (min-width: 576px) {
  .modal-dialog--lg .modal-dialog {
    max-width: 800px;
  }
}
</style>