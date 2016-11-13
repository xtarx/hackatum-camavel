<?php

if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class activity_requests_model extends MY_Model
{

    protected $_table      = 'activity_requests';
    protected $return_type = 'array';

    public function get_activities_requests($user_id)
    {
        $this->load->model('activities/activities_model');
        $this->load->model('activities/activity_locations_model');
        $this->load->model('activities/activity_memebers_model');
        $this->load->model('activities/activity_types_model');
        $this->load->model('activities/activity_todos_model');
        $this->load->model('account/users_fb_model');

        $requests = $this->activity_requests_model->get_many_by(array('sender_id' => $user_id));

        if (!$requests) {
            return false;
        }
        $activities = array();
        foreach ($requests as $key => $request) {

            $activity = $this->activities_model->get_full_details($request['activity_id']);

            $activity['request']   = $request;
            $date                  = date_create($request['created_at']);
            $activity['date_full'] = array(
                'booking'   => date_format($date, 'D\. j M\. Y'),
                'day_digit' => date_format($date, 'd'),
                'day_name'  => date_format($date, 'D'),
                'month'     => date_format($date, 'M'),

            );
            $activities[] = $activity;
        }
        return $activities;

    }
    public function get_received_activities_requests($user_id)
    {
        $this->load->model('activities/activities_model');
        $this->load->model('activities/activity_locations_model');
        $this->load->model('activities/activity_memebers_model');
        $this->load->model('activities/activity_types_model');
        $this->load->model('activities/activity_todos_model');
        $this->load->model('account/users_fb_model');

        $requests = $this->activity_requests_model->get_many_by(array('receiver_id' => $user_id, 'status' => 'pending'));

        if (!$requests) {
            return false;
        }
        $activities = array();
        foreach ($requests as $key => $request) {

            $activity = $this->activities_model->get_full_details($request['activity_id']);

            $activity['request']   = $request;
            $date                  = date_create($request['created_at']);
            $activity['date_full'] = array(
                'booking'   => date_format($date, 'D\. j M\. Y'),
                'day_digit' => date_format($date, 'd'),
                'day_name'  => date_format($date, 'D'),
                'month'     => date_format($date, 'M'),

            );
            $activities[] = $activity;
        }
        return $activities;

    }

}
