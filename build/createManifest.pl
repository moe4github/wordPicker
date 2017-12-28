use strict;
use warnings;

use File::Find;

my $files = fileList->new();

find( {wanted => sub { $files->addFile( $File::Find::name ); } }, '.' );

open( my $fh, ">", "manifest.cache");

print $fh "CACHE MANIFEST\n";
print $fh "#version: " . time . "\n\n";

foreach my $cacheFile ($files->getFiles() ) {
	print $fh $cacheFile . "\n";
}

close $fh;

print "done\n";



package fileList;

sub new {

	my $class = shift;

	my $self = bless{}, $class;
	$self->{list} = {};

	return $self;
}

sub addFile {

	my $self = shift;
	my $fileName = shift;

	$self->{list}{ substr($fileName, 2) } = undef if $fileName =~ /\.(html|js|css|png|eot|ttf|svg|woff)$/;
	return;
}

sub getFiles {

	my $self = shift;
	return sort keys %{$self->{list} };
}
