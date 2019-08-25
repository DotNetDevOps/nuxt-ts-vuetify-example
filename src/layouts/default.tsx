import Vue, { VNode } from 'vue';
import * as tsx from "vue-tsx-support";
import { Component, Prop, Watch } from 'vue-property-decorator';


export interface DefaultLayoutOptions {

}


@Component
export default class DefaultLayout extends tsx.Component<DefaultLayoutOptions>{

    render() {

      
        return (
            <v-app>
                <nuxt/>
            </v-app>

        )

    }
}