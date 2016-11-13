<?php

if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class activities_model extends MY_Model
{

    protected $_table      = 'activities';
    protected $return_type = 'array';
    public function get_full_details($id)
    {
        $this->load->model('activities/activities_model');
        $this->load->model('activities/activity_locations_model');
        $this->load->model('activities/activity_memebers_model');
        $this->load->model('activities/activity_types_model');
        $this->load->model('activities/activity_todos_model');
        $this->load->model('activities/activity_images_model');

        $this->load->model('account/users_fb_model');

        $activity = $this->activities_model->get($id);

        if ($activity) {

            //get activity type name
            //activity duration
            //camel #rides
            //places left

            $type                = $this->activity_types_model->get($activity['type']);
            $activity['type_id'] = $activity['type'];
            $activity['type']    = $type['name'];

            $todos = explode(PHP_EOL, $activity['agenda']);
            // $activity['todos'] = explode(PHP_EOL, $activity['agenda']);

            foreach ($todos as $key => $todo) {
                $todo_new['id']      = $key;
                $todo_new['name']    = $todo;
                $activity['todos'][] = $todo_new;
            }

            $joined_members = $this->activity_memebers_model->count_by(array('activity_id' => $id));

            $activity['on_board_count'] = $joined_members;

            $activity['vacancies'] -= $joined_members;
            $activity['main_image'] = $this->activity_images_model->get_by(array('activity_id' => $id));
            if ($activity['main_image']) {
                $activity['main_image']['file_name'] = base_url("uploads/" . $activity['main_image']['file_name']);
            } else {
                $activity['main_image']['file_name'] = "assets/img/tour_box_1.jpg";
            }

            $activity['promo_image'] = $this->activity_images_model->get_by(array('activity_id' => $id));
            if ($activity['promo_image']) {
                $activity['promo_image'] = base_url("uploads/" . $activity['promo_image']['file_name']);
            } else {
                $activity['promo_image'] = "assets/img/slide_hero.jpg";
            }

            $activity_creator = $this->users_fb_model->get($activity['creator_id']);

            $activity['user'] = array(
                'name'                => $activity_creator['first_name'] . " " . $activity_creator['last_name'],
                'profile_picture_url' => $activity_creator['profile_picture_url'],
                'rating'              => $activity_creator['rating'],
                'organized_activites' => $activity_creator['organized_activites'],

            );
            return $activity;
        }

    }
}
