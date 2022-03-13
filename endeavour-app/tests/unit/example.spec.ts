import { describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import AppButton from '@/components/AppButton.vue';

describe('AppButton.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(AppButton, { props: { msg } });
    expect(wrapper.text()).to.include(msg);
  });
});
