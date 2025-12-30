<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Platform } from 'quasar';

// Define specific types for validated props
type Position = 'top' | 'bottom' | 'left' | 'right' | 'center';
type Animation = 'swipeUp' | 'swipeDown' | 'swipeLeft' | 'swipeRight' | 'pulse' | 'rotate';
type HintPlatform = 'all' | 'mobile' | 'desktop';

// Define the props interface
interface Props {
  text?: string;
  icon?: string;
  iconSize?: string;
  iconColor?: string;
  position?: Position;
  animation?: Animation;
  duration?: number;
  backgroundColor?: string;
  zIndex?: number | string;
  hintId?: string | null;
  forceShow?: boolean;
  platform?: HintPlatform;
}

// Use withDefaults for default values with TypeScript
const props = withDefaults(defineProps<Props>(), {
  text: 'Swipe to close',
  icon: 'arrow_upward',
  iconSize: '24px',
  iconColor: 'white',
  position: 'bottom',
  animation: 'swipeUp',
  duration: 2500,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 10,
  hintId: null,
  forceShow: false,
  platform: 'all',
});

// Type the emits
const emit = defineEmits<{
  (e: 'hide'): void;
}>();

// Internal state with explicit types
const show = ref<boolean>(false);
const opacity = ref<number>(0);
let hideTimeout: NodeJS.Timeout | null = null;
let fadeOutTimeout: NodeJS.Timeout | null = null;

// Type for the object stored in localStorage
interface SeenHints {
  [key: string]: boolean;
}

// Check if hint has been seen before
const hasSeenHint = (): boolean => {
  if (!props.hintId || props.forceShow) return false;

  try {
    const storedHints = localStorage.getItem('app_seen_hints');
    if (!storedHints) return false;
    const seenHints: SeenHints = JSON.parse(storedHints);
    return !!seenHints[props.hintId];
  } catch (e) {
    console.error('Error checking hint status:', e);
    return false; // Assume not seen if there's an error
  }
};

// Mark hint as seen
const markHintAsSeen = (): void => {
  if (!props.hintId) return;

  try {
    const storedHints = localStorage.getItem('app_seen_hints') || '{}';
    const seenHints: SeenHints = JSON.parse(storedHints);
    seenHints[props.hintId] = true;
    localStorage.setItem('app_seen_hints', JSON.stringify(seenHints));
  } catch (e) {
    console.error('Error saving hint status:', e);
  }
};

// Check if should show based on device
const shouldShowOnDevice = (): boolean => {
  switch (props.platform) {
    case 'mobile':
      return Platform.is.mobile === true; // Explicit boolean check
    case 'desktop':
      return Platform.is.desktop === true; // Explicit boolean check
    case 'all':
    default:
      return true;
  }
};

onMounted(() => {
  if (!shouldShowOnDevice()) {
    emit('hide');
    return;
  }

  if (hasSeenHint()) {
    emit('hide');
    return;
  }

  show.value = true;

  setTimeout(() => {
    opacity.value = 1;
  }, 50); // Slight delay for transition

  if (props.duration > 0) {
    hideTimeout = setTimeout(() => {
      opacity.value = 0;

      fadeOutTimeout = setTimeout(() => {
        show.value = false;
        emit('hide');
        markHintAsSeen();
      }, 300); // Match transition duration
    }, props.duration);
  }
});

onBeforeUnmount(() => {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  if (fadeOutTimeout) {
    clearTimeout(fadeOutTimeout);
    fadeOutTimeout = null;
  }
});
</script>

<template>
  <div
    v-if="show"
    class="gesture-hint-overlay"
    :class="[
      `position-${position}`,
      `animation-${animation}`
    ]"
    :style="{
      backgroundColor,
      zIndex,
      opacity,
      transition: 'opacity 300ms ease-in-out'
    }"
  >
    <div class="gesture-content">
      <div class="gesture-indicator">
        <q-icon :name="icon" :size="iconSize" :color="iconColor" />
      </div>
      <div class="gesture-text q-mt-sm text-white text-caption text-center">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles remain the same */
.gesture-hint-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: flex;
  padding: 20px;
}

/* Positioning classes */
.position-top {
  align-items: flex-start;
  justify-content: center;
}

.position-bottom {
  align-items: flex-end;
  justify-content: center;
}

.position-left {
  align-items: center;
  justify-content: flex-start;
}

.position-right {
  align-items: center;
  justify-content: flex-end;
}

.position-center {
  align-items: center;
  justify-content: center;
}

.gesture-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gesture-indicator {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animation classes */
.animation-swipeUp .gesture-indicator {
  animation: swipeUp 1.5s ease-in-out infinite;
}

.animation-swipeDown .gesture-indicator {
  animation: swipeDown 1.5s ease-in-out infinite;
}

.animation-swipeLeft .gesture-indicator {
  animation: swipeLeft 1.5s ease-in-out infinite;
}

.animation-swipeRight .gesture-indicator {
  animation: swipeRight 1.5s ease-in-out infinite;
}

.animation-pulse .gesture-indicator {
  animation: pulse 1.5s ease-in-out infinite;
}

.animation-rotate .gesture-indicator {
  animation: rotate 1.5s ease-in-out infinite;
}

/* Keyframes for gesture animations */
@keyframes swipeUp {
  0% { transform: translateY(16px); }
  50% { transform: translateY(-16px); }
  100% { transform: translateY(16px); }
}

@keyframes swipeDown {
  0% { transform: translateY(-16px); }
  50% { transform: translateY(16px); }
  100% { transform: translateY(-16px); }
}

@keyframes swipeLeft {
  0% { transform: translateX(16px); }
  50% { transform: translateX(-16px); }
  100% { transform: translateX(16px); }
}

@keyframes swipeRight {
  0% { transform: translateX(-16px); }
  50% { transform: translateX(16px); }
  100% { transform: translateX(-16px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
