@extends('account')

@section('style')
    <link rel="stylesheet" href="static/css/style.css">
@endsection

@section('content')
    <div class="container">
        <div class="d-flex flex-column align-items-center text-center p-3 py-5">
            <img class="rounded-circle mt-5" width="150px"
                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg">
            <span class="font-weight-bold">Edogaru</span>
            <span class="text-black-50">edogaru@mail.com.my</span>
            <span></span>
        </div>
        <div class="p-3 py-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="text-right">Profile Settings</h4>
            </div>
            <div class="row mt-2">
                <div class="col-md-6"><label class="labels">Name</label><input type="text" class="form-control"
                        placeholder="first name" value=""></div>
                <div class="col-md-6"><label class="labels">Surname</label><input type="text" class="form-control"
                        value="" placeholder="surname"></div>
            </div>
            <div class="row mt-3">
                <div class="col-md-12"><label class="labels">Mobile Number</label><input type="text"
                        class="form-control" placeholder="enter phone number" value=""></div>
                <div class="col-md-12"><label class="labels">Address</label><input type="text"
                        class="form-control" placeholder="enter address line 1" value=""></div>
                <div class="col-md-12"><label class="labels">State</label><input type="text" class="form-control"
                        placeholder="enter address line 2" value=""></div>
                <div class="col-md-12"><label class="labels">Area</label><input type="text" class="form-control"
                        placeholder="enter address line 2" value=""></div>
                <div class="col-md-12"><label class="labels">Email ID</label><input type="text" class="form-control"
                        placeholder="enter email id" value=""></div>
            </div>
            <div class="row mt-3">
                <div class="col-md-6"><label class="labels">Country</label><input type="text" class="form-control"
                        placeholder="country" value=""></div>
                <div class="col-md-6"><label class="labels">State/Region</label><input type="text"
                        class="form-control" value="" placeholder="state"></div>
            </div>
            <div class="mt-5 text-center">
                <button class="btn btn-secondary" type="button">Back</button>
                <button class="btn btn-primary profile-button" type="button">Save Profile</button>
            </div>
        </div>
    </div>
@endsection
