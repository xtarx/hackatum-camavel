<?php defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

class Requests extends REST_Controller
{

    public function __construct()
    {
        parent::__construct();
        header("Access-Control-Allow-Origin: *");

        $this->load->model('activities/activities_model');
        $this->load->model('activities/activity_requests_model');
        $this->load->model('activities/activity_memebers_model');
        $this->load->model('account/users_fb_model');

    }

    public function add_post()
    {

        $user_id = is_authorized();
        // echo "user" . $user_id;

        $message = array(
            'sender_id'   => $user_id,
            'activity_id' => $this->post('activity_id'),
            'receiver_id' => $this->post('receiver_id'),
            'refrence'    => generate_token(),

        );
        // $user_exists = $this->activity_requests_model->get_by(array('sender_id' => $user_id, 'activity_id' => $this->post('activity_id')));

        // $this->response(array('id' => $user_exists), 200);

        $request_id = $this->activity_requests_model->insert($message);

        if ($request_id) {

            $this->response(array('id' => $request_id), 200); // 200 being the HTTP response code
        } else {
            $this->response(null, 404);
        }

    }

    public function accept_post()
    {

        //add security

        $this->activity_requests_model->update($this->post('request_id'), array('status' => 'accept'));
        $request = $this->activity_requests_model->get($this->post('request_id'));

        //add to activity members
        $message = array(
            'activity_id' => $request['activity_id'],
            'member_id'   => $request['sender_id'],
        );

        $this->activity_memebers_model->insert($message);
        //notify member

        $this->set_response(array('success' => true), REST_Controller::HTTP_CREATED);
    }
    public function reject_post()
    {

        //add security

        $this->activity_requests_model->update($this->post('request_id'), array('status' => 'reject'));
        $request = $this->activity_requests_model->get($this->post('request_id'));

        //notify member

        $this->set_response(array('success' => true), REST_Controller::HTTP_CREATED);
    }

    public function get_get()
    {

        // $request = $this->activity_requests_model->get($this->post('request_id'));
        $request = $this->activity_requests_model->get(1);

        $activity = $this->activities_model->get_full_details($request['activity_id']);

        if ($activity) {

            $this->response($activity, 200); // 200 being the HTTP response code
        } else {
            $this->response(null, 404);
        }

    }

    public function get_for_user_get()
    {

        $user_id = is_authorized();
        // echo "userid" . $user_id;

        $requests = $this->activity_requests_model->get_activities_requests($user_id);

        if ($requests) {
            $this->response($requests, 200); // 200 being the HTTP response code
        } else {
            $this->response(null, 404);
        }

    }

    public function get_to_user_get()
    {

        // $this->response(null, 200);

        $user_id = is_authorized();
        // echo "userid" . $user_id;

        $requests = $this->activity_requests_model->get_received_activities_requests($user_id);
        // print_r($requests);

        if ($requests) {
            $this->response($requests, 200); // 200 being the HTTP response code
        } else {
            $this->response(null, 404);
        }

    }

    public function get_contribution_get($refrence)
    {

        $activity_request = $this->activity_requests_model->get_by(array('refrence' => $refrence));

        if ($activity_request) {
            // echo $activity_request['activity_id'];
            $activity = $this->activities_model->get($activity_request['activity_id']);

            $this->response($activity, 200); // 200 being the HTTP response code
        } else {
            $this->response(null, 404);
        }

    }
    public function can_request_get($activity_id)
    {
        $user_id = is_authorized();

        // echo "userid" . $user_id;
        $activity = $this->activities_model->get($activity_id);

        $applied_before = $this->activity_requests_model->get_by(array('activity_id' => $activity_id, 'sender_id' => $user_id));

        // echo "creator is " . $activity['creator_id'];
        // echo "usr is " . $user_id;

        if ($activity['creator_id'] != $user_id && !$applied_before) {

            $this->set_response(array('can' => true), REST_Controller::HTTP_CREATED);
            return;
        } else {
            $this->set_response(array('can' => false), REST_Controller::HTTP_CREATED);
        }
    }

}
