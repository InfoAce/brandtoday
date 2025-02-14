<template>
    <div class="modal theme-modal fade bd-example-modal-lg" id="ordertimeline" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Order Timeline</h5>
                    <button type="button" class="btn-close" @click="$emit('update-modal',false)" aria-label="Close">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="col-sm-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <ol class="progtrckr">
                                            <li class="progtrckr-done" v-for="(timeline, index) in timelines">
                                                <h5>Order was {{ timeline.name }}</h5>
                                                <h6>{{ moment(timeline.created).format('lll') }}</h6>
                                            </li>
                                        </ol>

                                        <div class="col-12 overflow-visible">
                                            <div class="tracker-table all-package">
                                                <div class="table-responsive">
                                                    <table class="table">
                                                        <thead>
                                                            <tr class="table-head">
                                                                <th scope="col">Date</th>
                                                                <th scope="col">Time</th>
                                                                <th scope="col">Description</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr v-for="(timeline, index) in timelines">
                                                                <td>
                                                                    <h6>{{ moment(timeline.created).format('Do MMMM, Y') }}</h6>
                                                                </td>
                                                                <td>
                                                                    <h6>{{ moment(timeline.created).format('hh:mm:ss') }}</h6>
                                                                </td>
                                                                <td>
                                                                    <p class="fw-bold">{{ timeline.name }}</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" type="button" @click="$emit('update-modal',false)">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>                
</template>

<script lang="ts" setup>
import { computed, defineProps, watch } from 'vue';
import { isEmpty } from 'lodash';
import moment from 'moment';

/**
 * Define component properties
 * 
 * @typedef {Object} OrderTimelineProps
 * @property {Object[]} data - The order timeline array
 * @prop {OrderTimelineProps} props - The component properties
 */
const $props = defineProps({
    /**
     * The order timeline array
     * 
     * @type {Object[]}
     */
    data:{
        /**
         * The default value of the prop
         */
        default: () => Object(),
        /**
         * The type of the prop
         */
        type:    Object
    },
});

/**
 * Computed order from component properties
 * 
 * @param {defineProps}
 * @returns {Object}
 */
const timelines    = computed(() => $props.data.timelines);


/**
 * Watch for changes
 * 
 * @param {Object}
 * @returns void
 */
 watch(
    () => $props.data.timelines,
    (data) => {
        if( !isEmpty(data) ){
            $('#ordertimeline').modal('show');
        }
        if( isEmpty(data)){
            $('#ordertimeline').modal('hide');
        }
    }
)
</script>